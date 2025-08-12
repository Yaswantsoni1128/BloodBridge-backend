import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'

export const validateJWT =async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken|| req.header('Authorization')?.replace('Bearer ','');
        if(!token){
            return res.status(401).json({
                message:"Unauthorised: No token provided"
            });
        }
        const decoded= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user= await User.findById(decoded?._id).select('-password -refreshToken');
        if(!user){
            return res.status(401).json({
                message:"Unauthorised: User not found"
            });
        }
        req.user=user;
        next();
    } catch (error) {
        return res.status(401).json({
            message:"Unauthorised: Invalid token"
        });
    }
}