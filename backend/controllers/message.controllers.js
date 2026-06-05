import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getsocketId, io } from "../socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { message } = req.body;
    let image;
    console.log(req.file);

    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      console.log("Cloudinary response:", uploaded);
      image = uploaded;
    }

    if (!message && !image) {
      return res.status(400).json({
        message: "Message or image required",
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

   
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    const newMessage = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      receiver: receiverId,
      message,
      image,
    });


    conversation.messages.push(newMessage._id);
    conversation.lastMessage = message || "Image";
    conversation.lastMessageAt = new Date();

    await conversation.save();

   const populatedMsg = await newMessage.populate(
  "sender",
  "userName profileImage"
);

const receiverSocketId = getsocketId(receiverId);

if (receiverSocketId) {
  io.to(receiverSocketId).emit("newMessage", {
  message: populatedMsg,
});

io.to(receiverSocketId).emit("updateUnreadCount");
}
    res.status(201).json({
      message: newMessage,
    });

  } catch (error) {
    res.status(500).json({
      message: "Send message error",
      error: error.message,
    });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } }).populate("messages")

    res.status(200).json(conversation?.messages);

  } catch (error) {
    res.status(500).json({
      message: "Get messages error",
      error: error.message,
    });
  }
};

export const getPevUserChats = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate("participants", "userName name profileImage")
      .sort({ updatedAt: -1 });
  const formatted = await Promise.all(
  conversations.map(async (conv) => {

    const otherUser = conv.participants.find(
      (p) => p._id.toString() !== currentUserId.toString()
    );

    const unseenCount = await Message.countDocuments({
      conversationId: conv._id,
      receiver: currentUserId,
      seen: false,
    });

    return {
      _id: conv._id,
      user: otherUser,
      lastMessage: conv.lastMessage,
      lastMessageAt: conv.lastMessageAt,
      unseenCount,
    };
  })
);

    res.status(200).json({
      data: formatted,
    });

  } catch (error) {
    res.status(500).json({
      message: "Get conversations error",
      error: error.message,
    });
  }
};

export const markMessagesAsSeen = async (req, res) => {
  try {
    const userId = req.userId;
    const otherUserId = req.params.receiverId;

    const result = await Message.updateMany(
      {
        sender: otherUserId,
        receiver: userId,
        seen: false,
      },
      {
        $set: { seen: true },
      }
    );

    return res.status(200).json({
      message: "Messages marked as seen",
      updatedCount: result.modifiedCount,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Seen update error",
      error: error.message,
    });
  }
};

export const getUnreadMessageCount = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await Message.countDocuments({
      receiver: userId,
      seen: false,
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};