import Reel from "../models/reel.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import fs from "fs";
import User from "../models/user.model.js";
import { getsocketId, io } from "../socket.js";
import Notification from "../models/notifiction.model.js";

export const uploadReel = async (req, res) => {
  try {
    const userId = req.userId;
    const { caption } = req.body;

    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "Reel video is required",
      });
    }

    if (!req.file.mimetype.startsWith("video")) {
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        message: "Only video allowed for reels",
      });
    }

    const uploadedUrl = await uploadOnCloudinary(req.file.path);

    if (!uploadedUrl) {
      return res.status(500).json({
        message: "Upload failed",
      });
    }
    const newReel = await Reel.create({
      author: userId,
      media: uploadedUrl,
      caption: caption || "",
    });

    await User.findByIdAndUpdate(userId, {
      $push: { reels: newReel._id },
    });

    const populatedReel = await Reel.findById(newReel._id).populate(
      "author",
      "name userName profileImage"
    );

    return res.status(201).json({
      message: "Reel uploaded successfully",
      reel: populatedReel,
    });

  } catch (error) {
    console.log("ERROR:", error);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

export const likeUnlikeReel = async (req, res) => {
  try {
    const userId = req.userId;
    const reelId = req.params.reelId;

    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    const isLiked = reel.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (isLiked) {
      reel.likes = reel.likes.filter(
        (id) => id.toString() !== userId.toString()
      );

      await reel.save();

      io.emit("likeReel", {
        reelId: reel._id.toString(),
        likes: reel.likes,
        liked: false,
      });

      return res.status(200).json({
        message: "Reel unliked",
        liked: false,
        totalLikes: reel.likes.length,
      });
    }
    reel.likes.push(userId);
    await reel.save()
    if (reel.author.toString() !== userId.toString()) {
      const notification = await Notification.create({
        sender: userId,
        receiver: reel.author,
        type: "like",
        reel: reel._id,
        message: "Liked your reel",
      });

      const populatedNotification = await Notification.findById(
        notification._id
      ).populate("sender", "userName profileImage");

      const receiverSocketId = getsocketId(reel.author);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit(
          "newNotification",
          populatedNotification
        );
      }
    }

    io.emit("likeReel", {
      reelId: reel._id.toString(),
      likes: reel.likes,
      liked: true,
    });

    return res.status(200).json({
      message: "Reel liked",
      liked: true,
      totalLikes: reel.likes.length,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};
export const addCommentReel = async (req, res) => {
  try {
    const userId = req.userId;
    const reelId = req.params.reelId;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res.status(404).json({
        message: "Reel not found",
      });
    }

    const newComment = {
      author: userId,
      message: message.trim(),
    };

    reel.comments.push(newComment);
    await reel.save();
    await reel.populate(
      "comments.author",
      "userName profileImage"
    );

    const savedComment =
      reel.comments[reel.comments.length - 1];
    if (reel.author.toString() !== userId.toString()) {
      const notification = await Notification.create({
        sender: userId,
        receiver: reel.author,
        type: "comment",
        reel: reel._id,
        commentText: message.trim(),
        message: "Commented on your reel",
      });

      const populatedNotification = await Notification.findById(
        notification._id
      ).populate("sender", "userName profileImage");

      const receiverSocketId = getsocketId(reel.author);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit(
          "newNotification",
          populatedNotification
        );
      }
    }

    io.emit("commentReel", {
      reelId: reel._id.toString(),
      comments: reel.comments,
    });

    return res.status(200).json({
      message: "Comment added",
      comment: savedComment,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};
export const getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate("author", "name userName profileImage")
      .populate("comments.author")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      reels
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};