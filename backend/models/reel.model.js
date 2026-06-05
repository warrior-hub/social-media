import mongoose from "mongoose";
const reelSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    media: {
        type: String,
        required: true
    },
    caption: {
        type: String,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            message: {
                type: String
            }
        }
    ]

}, { timestamps: true })

const Reel = mongoose.model("Reel", reelSchema);
export default Reel;