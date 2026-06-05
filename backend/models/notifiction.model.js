import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["like", "comment", "follow","message"],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  },
  reel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reel"
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;