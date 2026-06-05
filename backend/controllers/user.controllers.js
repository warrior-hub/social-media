import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../models/notifiction.model.js";
import User from "../models/user.model.js";
import { getsocketId, io } from "../socket.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId)
      .select("-password")
      .populate("posts")
      .populate("reels")
      .populate("followers", "userName profileImage")
      .populate("following", "userName profileImage");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
      following: user.following
    });
  } catch (error) {
    return res.status(500).json({
      message: "Get current user error",
      error: error.message,
    });
  }
};

export const suggestedUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select("-password").limit(10)
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ message: "Get suggested user error" })
  }
}

export const editProfile = async (req, res) => {
  try {
    const { name, userName, bio, gender, profession } = req.body;

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }


    if (userName) {
      const sameUserWithUserName = await User.findOne({ userName });

      if (
        sameUserWithUserName &&
        sameUserWithUserName._id.toString() !== req.userId
      ) {
        return res.status(400).json({ message: "User name already exist" });
      }

      user.userName = userName;
    }


    if (req.file) {
      const profileImage = await uploadOnCloudinary(req.file.path);
      if (profileImage) {
        user.profileImage = profileImage;
      }
    }


    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profession) user.profession = profession;

    await user.save();

    return res.status(200).json({
      message: "Profile Updated!",
      user,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Profile update error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userName } = req.params;

    if (!userName) {
      return res.status(400).json({
        message: "Username is required",
      });
    }

    const user = await User.findOne({ userName })
      .select("-password")
      .populate("posts")
      .populate("reels")
      .populate("followers", "userName profileImage")
      .populate("following", "userName profileImage");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Get profile error",
      error: error.message,
    });
  }
};
export const followUnfollow = async (req, res) => {
  try {
    const userId = req.userId;
    const targetUserId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (userId === targetUserId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const user = await User.findById(userId);

    const isFollowing = user.following.includes(targetUserId);

    if (isFollowing) {
      await User.findByIdAndUpdate(userId, {
        $pull: { following: targetUserId }
      });

      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: userId }
      });

      return res.json({ followed: false });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { following: targetUserId }
      });

      await User.findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: userId }
      });

     
      const notification = await Notification.create({
        sender: userId,
        receiver: targetUserId,
        type: "follow",
        message: "Started following you",
      });

      
      const populatedNotification = await Notification.findById(notification._id)
        .populate("sender", "userName profileImage");

     
      const receiverSocketId = getsocketId(targetUserId);

     
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }

      return res.json({ followed: true });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const search = async (req, res) => {
  try {
    const keyword = req.query.keyword
    console.log("search hitt");

    if (!keyword) {
      return res.status(400).json({ message: "keyword is required!" })
    }
    console.log(keyword);

    const users = await User.find({
      $or: [
        { userName: { $regex: keyword, $options: "i" } },
        { name: { $regex: keyword, $options: "i" } }
      ]
    }).select("-password");

    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ message: `Search error ${error}` })
  }
}

export const getAllNotifications = async (req, res) => {
  try {
    console.log(" notifications hit");

    const notifications = await Notification.find({ receiver: req.userId }).populate("sender receiver post reel")
    return res.status(200).json(notifications)
  } catch (error) {
    return res.status(500).json({ message: `get notification error ${error}` })
  }
}

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { receiver: req.userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};