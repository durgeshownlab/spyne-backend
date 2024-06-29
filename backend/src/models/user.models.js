import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        userName: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        mobile: {
            type: Number,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true
    }
)

// code for converting the password to the hash format before saving 
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password=await bcrypt.hash(this.password, 10);
    next()
});

// code for isPasswordCorrect method
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

// code for generateAccessToken method
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.userName,
            name: this.name,
            email: this.email,
            mobile: this.mobile,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN
        }
    )
}

// code for generateRefreshToken method
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN
        }
    )
}

export const User = mongoose.model("User", userSchema);