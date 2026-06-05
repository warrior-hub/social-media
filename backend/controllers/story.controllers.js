import Story from "../models/story.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import fs from "fs";
import User from "../models/user.model.js";

export const uploadStory = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({
        message: "Story media is required",
      });
    }

    await Story.deleteOne({ author: userId });
    const uploaded = await uploadOnCloudinary(req.file.path);

    if (!uploaded) {
      return res.status(500).json({
        message: "Upload failed",
      });
    }

    const mediaType = req.file.mimetype.startsWith("video")
      ? "video"
      : "image";

    const newStory = await Story.create({
      author: userId,
      media: uploaded,
      mediaType,
    });

    await User.findByIdAndUpdate(userId, {
      story: newStory._id,
    });

    const populatedStory = await Story.findById(newStory._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");

    return res.status(201).json({
      message: "Story uploaded successfully",
      story: populatedStory,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

export const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("author", "userName profileImage")
      .sort({ createdAt: -1 });
    const grouped = {};

    stories.forEach((story) => {
      const userId = story.author._id.toString();

      if (!grouped[userId]) {
        grouped[userId] = {
          user: story.author,
          stories: [],
        };
      }

      grouped[userId].stories.push(story);
    });

    return res.status(200).json({
      stories: Object.values(grouped),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const viewStory = async (req, res) => {
  try {
    const userId = req.userId;
    const storyId = req.params.storyId;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.author.toString() === userId) {
      return res.status(200).json({ message: "Own story" });
    }

    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { $addToSet: { viewers: userId } },
      { new: true }
    ).populate("viewers", "userName profileImage");

    return res.status(200).json({
      message: "Story viewed successfully",
      totalViews: updatedStory.viewers.length,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

export const getStoryByUserName = async (req, res) => {
  try {
    const userName = req.params.userName;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const stories = await Story.find({ author: user._id })
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");

    return res.status(200).json({
      message: "Stories fetched successfully",
      stories,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};