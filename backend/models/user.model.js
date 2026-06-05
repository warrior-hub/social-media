import mongoose from "mongoose";
import Post from "./post.model.js";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    saved: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],

    reels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reel"
        }
    ],
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story"
    },
    resetOtp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    bio: {
        type: String
    },
    profession:{
        type:String
    },
    gender:{
        type:String,
        enum:["male","female"]
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)
export default User;