import {User} from "../models/user.model.js"
import sendEmail from "../services/sendEmail.js"
import crypto from "crypto";
const userController={
    login: async(req,res)=>{
        try {
            const {email,password}=req.body;
            const user= await User.findOne({email});    
            if(!user){
                return res.status(400).json({message:"User not found"});
            }
            const isPasswordCorrect=await user.isPasswordCorrect(password);
            if(!isPasswordCorrect){
                return res.status(400).json({message:"Invalid password"});
            }
            const accessToken=user.generateAcessToken();
            const refreshToken=user.generateRefreshToken();
            user.refreshToken=refreshToken;
            await user.save();
            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,
                secure:true,
                sameSite:"strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                message:"Logged in successfully",
                accessToken,
                user:{
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    phone:user.phone,
                    role:user.role,
                },
            });
        } catch (error) {
            console.log("Error during login: ",error);
            res.status(500).json({message:"Internal server error"});
        }
    },

    register: async(req,res)=>{
        try {
            const {name, email, password, phone}= req.body;
            const existingUser = await User.findOne({
                $or: [{ email }, { phone }],
            });
            if(existingUser){
                return res.status(400).json({message:"Email or phone number already in use"});
            }
            const newUser= await User.create({
                name,
                email,
                password,
                phone
            });
            const accessToken=newUser.generateAcessToken();
            const refreshToken=newUser.generateRefreshToken();
            newUser.refreshToken=refreshToken;
            await newUser.save();
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            }
            );
            res.status(201).json({
                message: "User created successfully",
                accessToken,
                refreshToken,
                user:{
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    phone:newUser.phone,
                    role:newUser.role,
                }
            });
        } catch (error) {
            console.log("Error during registeration:",error);
            res.status(500).json({
                message:"Internal Server Error"
            });   
        }
    },

    logout: async(req,res)=>{
        try {
            const {refreshToken}=req.cookies;
            if(!refreshToken){
                return res.status(400).json({message:"No refresh token found"});
            }
            const user= await User.findOne({refreshToken});
            if(!user){
                return res.status(400).json({message:"User not found"});
            }
            user.refreshToken=null;
            await user.save();
            res.clearCookie("refreshToken");
            res.status(200).json({message:"Logged out successfully"});
        } catch (error) {
            console.error("Error during logout:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    refreshAccessToken: async(req,res)=>{
        try {
            const {refreshToken}=req.cookies;
            if(!refreshToken){
                return res.status(400).json({message:"No refresh token found"});
            }
            const user= await User.findOne({refreshToken});
            if(!user){
                return res.status(400).json({message:"User not found"});
            }
            const newAccessToken=user.generateAcessToken();
            res.status(200).json({
                message: "Access token refreshed successfully",
                accessToken: newAccessToken
            })
        } catch (error) {
            console.error("Error during token refresh:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getCurrentUser: async(req,res)=>{
        try {
            const user= await User.findById(req.user._id)
            if(!user){
                return res.status(400).json({message:"User not found"});
            }
            res.status(200).json({
                message: "User data retrieved successfully",
                user:{
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                    phone:user.phone
                }
            });
        } catch (error) {
            console.error("Error retrieving user:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    updateCurrentUser: async(req,res)=>{
        try {
            const {name,email,phone}= req.body;
            const user= await User.findByIdAndUpdate(
                req.user._id,
                {name,email,phone},
                {new:true}
            );
            if(!user){
                return res.status(400).json({message:"User not found"});
            }
            res.status(200).json({
                message: "User data updated successfully",
                user:{
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    phone:user.phone,
                    role:user.role,
                }
            });
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    deleteUser:async(req,res)=>{
        try {
            const user= await User.findByIdAndDelete(req.user._id);
            if(!user){
                return res.status(400).json({message:"User not found"});
            }
            res.status(200).json({
                message: "User deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    forgotPassword: async(req,res)=>{
        try {
            const user= await User.findOne({email:req.body.email});
            if(!user){
                return res.status(400).json({message:"User not found"});
            }
            const resetToken= user.getResetPasswordToken();
            await user.save({validateBeforeSave: false});
            const message = `Use this token to reset your password: ${resetToken}`;
            try {
                await sendEmail({
                    to: user.email,
                    subject: "Password Reset ",
                    message: `<p>${message}</p>`
                });
                res.status(200).json({message: "Email sent successfully"});
            } catch (error) {
                
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                await user.save({ validateBeforeSave: false });
    
                res.status(500).json({ message: "Failed to send email" });
            }
        } catch (error) {
            console.error("Error in forgotPassword:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    resetPassword: async(req,res)=>{
        try {
            const hashedToken= crypto.createHash('sha256').update(req.body.token).digest('hex');
            const user= await User.findOne({resetPasswordToken:hashedToken,resetPasswordExpire: {$gt:Date.now()}});
            if(!user){
                return res.status(400).json({message:"Invalid token or token has expired"});
            }
            user.password=req.body.password;
            user.resetPasswordToken=undefined;
            user.resetPasswordExpire=undefined;
            await user.save();
            res.status(200).json({message: "Password reset successfully"});
        } catch (error) {
            console.error("Error in resetPassword:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default userController;