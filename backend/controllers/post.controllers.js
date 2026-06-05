import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import fs from "fs";
import User from "../models/user.model.js";
import { getsocketId, io } from "../socket.js";
import Notification from "../models/notifiction.model.js";

export const uploadPost = async (req, res) => {
  try {
    const userId = req.userId;
    const { caption } = req.body;
    if (req.file) {
      console.log(req.file);

    }
    if (!req.file) {
      return res.status(400).json({
        message: "Media file is required",
      });
    }


    const uploaded = await uploadOnCloudinary(req.file.path);

    if (!uploaded) {
      return res.status(500).json({
        message: "Upload failed",
      });
    }

    let mediaType = "image";
    if (req.file.mimetype.startsWith("video")) {
      mediaType = "video";
    }

    console.log("UPLOADED FULL RESPONSE:", uploaded);
    console.log(uploaded.secure_url);

    const newPost = await Post.create({
      author: userId,
      media: uploaded,
      mediaType,
      caption,
    });

    const user = await User.findById(req.userId);
    user.posts.push(newPost)
    await user.save();
    const populatedPost = await Post.findById(newPost._id).populate(
      "author",
      "name userName profileImage"
    );

    return res.status(201).json({
      message: "Post uploaded successfully",
      post: populatedPost,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name userName profileImage")
      .populate("comments.author", "userName profileImage")
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      message: "Posts fetched successfully",
      totalPosts: posts.length,
      posts,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};
export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
      if (post.author._id != req.userId) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: post.author._id,
          type: "like",
          post: post._id,
          message: "Liked your post"
        })
        const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")
        const receiverSocketId = getsocketId(post.author._id)

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newNotification", populatedNotification)
        }
      }

    }

    await post.save();
    io.emit("likePost", {
      postId: post._id,
      likes: post.likes
    })

    await post.populate("author", "name userName profileImage");

    return res.status(200).json({
      message: isLiked ? "Post unliked" : "Post liked",
      post
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Message required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      author: userId,
      message: message.trim(),
    };

    post.comments.push(newComment);
    await post.save();

    await post.populate("comments.author", "userName profileImage");

    const savedComment = post.comments[post.comments.length - 1];
    if (post.author.toString() !== userId.toString()) {
      const notification = await Notification.create({
        sender: userId,
        receiver: post.author,
        type: "comment",
        post: post._id,
        commentText: message.trim(),
        message: "Commented your post",
      });

      const populatedNotification = await Notification.findById(
        notification._id
      ).populate("sender receiver post");

      const receiverSocketId = getsocketId(post.author);

      if (receiverSocketId && io) {
        io.to(receiverSocketId).emit(
          "newNotification",
          populatedNotification
        );
      }
    }

    io.emit("CommentedPost", {
      postId: post._id,
      comments: post.comments,
    });

    return res.status(200).json({
      message: "Comment added",
      comment: savedComment,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

export const saveUnsavePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSaved = user.saved.includes(postId);

    if (isSaved) {
      user.saved = user.saved.filter(
        (id) => id.toString() !== postId
      );
    } else {
      user.saved.push(postId);
    }

    await user.save();

    return res.status(200).json({
      message: isSaved ? "Post unsaved" : "Post saved",
      savedPosts: user.saved,
    });

  } catch (error) {
    console.log("SAVE ERROR:", error); // 👈 IMPORTANT
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};