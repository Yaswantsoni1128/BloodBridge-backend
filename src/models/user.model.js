import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from "crypto";
const userSchema= new mongoose.Schema(
    {
        name:{
            type:String,
            trim:true,
            lowercase:true,
            required:true,
            index:true,
        },
        email: {
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        password:{
            type:String,
            required:[true,"Password is required"],
            minlength:[6,"Password should be at least 6 characters long"],
        },
        phone:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [/^\d{10}$/, "Enter a valid 10-digit phone number"],
        },
        role:{
            type:String,
            enum:["BloodBank","hospital"],
            default:"hospital",
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpire: {
            type: Date,
        },
        refreshToken: {
            type: String,
        },
    },{
        timestamps:true,
    }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect=async function(pasword){
    return await bcrypt.compare(pasword,this.password);
}

userSchema.methods.generateAcessToken= function(){
    return jwt.sign({
        _id:this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
);
};

userSchema.methods.generateRefreshToken= function(){
    return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }   
);      
}

userSchema.methods.getResetPasswordToken= function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken= crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    this.resetPasswordExpire= Date.now() + 15 * 60 * 1000;
    return resetToken;
};

export const User = mongoose.model("User", userSchema);


