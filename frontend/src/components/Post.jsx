import React, { useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import VideoPlayer from "./VideoPlayer";
import { GoHeart, GoHeartFill } from "react-icons/go";
import {
  MdOutlineBookmark,
  MdOutlineComment,
  MdOutlineBookmarkBorder,
} from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPostData } from "../redux/postSlice";
import FollowButton from "./FollowButton";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import SERVER_URL from "../config";

const Post = ({ post }) => {
  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [showComment, setshowComment] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLiked = post?.likes?.includes(userData?._id);

  const handleLike = async () => {
    if (loading) return;

    try {
      if (!userData?._id) return;

      setLoading(true);

      const res = await axios.get(
        `${SERVER_URL}/api/post/like/${post._id}`,
        { withCredentials: true },
      );
      const updatedPost = res.data.post || res.data;
      const updatedPosts = postData.posts.map((p) =>
        p._id === updatedPost._id ? updatedPost : p,
      );
      dispatch(
        setPostData({
          ...postData,
          posts: updatedPosts,
        }),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    if (commentLoading) return;

    try {
      console.log("cliked");
      setCommentLoading(true);

      const res = await axios.post(
        `${SERVER_URL}/api/post/comment/${post._id}`,
        { message: commentText },
        { withCredentials: true },
      );
      console.log(res.data.comment);
      const newComment = res.data.comment;

      const updatedPosts = postData.posts.map((p) =>
        p._id === post._id
          ? { ...p, comments: [...p.comments, newComment] }
          : p,
      );

      dispatch(
        setPostData({
          ...postData,
          posts: updatedPosts,
        }),
      );
      setCommentText("");
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleSaveUnsave = async (postId) => {
    try {
      const res = await axios.put(
        `${SERVER_URL}/api/post/saved/${postId}`,
        {},
        { withCredentials: true },
      );

      const updatedSaved = res.data.savedPosts;
      dispatch(
        setUserData({
          ...userData,
          saved: updatedSaved,
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket?.on("likePost", (updatedData) => {
      dispatch(
        setPostData({
          ...postData,
          posts: postData.posts.map((p) =>
            p._id === updatedData.postId
              ? { ...p, likes: updatedData.likes }
              : p,
          ),
        }),
      );
    });

    socket?.on("CommentedPost", (updatedData) => {
      dispatch(
        setPostData({
          ...postData,
          posts: postData.posts.map((p) =>
            p._id === updatedData.postId
              ? { ...p, comments: updatedData.comments }
              : p,
          ),
        }),
      );
    });

    return () => {
      socket?.off("likePost");
      socket?.off("CommentedPost");
    };
  }, [socket, postData]);

  useEffect(() => {
    if (!socket) return;

    const handleComment = (updatedData) => {
      dispatch(
        setPostData({
          ...postData,
          posts: postData.posts.map((p) =>
            p._id === updatedData.postId
              ? { ...p, comments: updatedData.comments }
              : p,
          ),
        }),
      );
    };

    socket.on("CommentedPost", handleComment);

    return () => socket.off("CommentedPost", handleComment);
  }, [socket, dispatch]);
  return (
    <div className="w-[90%] min-h-[450px] flex flex-col gap-[10px] bg-white items-center shadow-2xl rounded-2xl overflow-hidden">
      <div className="w-full h-[80px] flex justify-between items-center px-[10px]">
        <div className="flex items-center gap-[20px]">
          <div
            className="w-[50px] h-[50px] cursor-pointer rounded-full overflow-hidden border-2 border-black"
            onClick={() => navigate(`/profile/${post.author.userName}`)}
          >
            <img
              src={post?.author?.profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className="font-semibold cursor-pointer"
            onClick={() => navigate(`/profile/${post.author.userName}`)}
          >
            {post?.author?.userName}
          </div>
        </div>
        {userData?._id != post.author._id && (
          <FollowButton
            className={
              "px-[10px] cursor-pointer py-[5px] bg-black text-white rounded-[10px]"
            }
            targetUserId={post.author._id}
          ></FollowButton>
        )}
      </div>
      <div className="w-full flex justify-center p-3">
        {post?.mediaType === "image" && (
          <img
            src={post?.media}
            alt=""
            className="max-h-[400px] rounded-2xl object-contain"
          />
        )}

        {post?.mediaType === "video" && (
          <div className="w-full max-w-[500px]">
            <VideoPlayer media={post?.media} />
          </div>
        )}
      </div>
      <div className="w-full flex justify-between px-4 py-3">
        <div className="flex items-center gap-4 text-xl">
          {!isLiked ? (
            <GoHeart
              onClick={handleLike}
              className="w-[25px] h-[25px] cursor-pointer"
            />
          ) : (
            <GoHeartFill
              onClick={handleLike}
              className="w-[25px] h-[25px] cursor-pointer text-red-600"
            />
          )}

          <span>{post?.likes?.length || 0}</span>
          <MdOutlineComment
            onClick={() => setshowComment(!showComment)}
            className="w-[25px] h-[25px] cursor-pointer"
          />
          <span>{post?.comments?.length || 0}</span>
        </div>
        <div className="text-xl" onClick={() => handleSaveUnsave(post._id)}>
          {!userData?.saved?.includes(post?._id) ? (
            <MdOutlineBookmarkBorder className="w-[25px] h-[25px] cursor-pointer" />
          ) : (
            <MdOutlineBookmark className="w-[25px] h-[25px] cursor-pointer" />
          )}
        </div>
      </div>

      {post?.caption?.trim() && (
        <div className="w-full px-4 py-2">
          <p>
            <span className="font-semibold">{post?.author?.userName}</span>{" "}
            <span className="text-gray-700">{post?.caption}</span>
          </p>
        </div>
      )}

      {showComment && (
        <div className="w-full  mt-2 bg-white">
          <div className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50">
            <img
              src={userData?.profileImage || dp}
              alt=""
              className="w-9 h-9 rounded-full object-cover border"
            />

            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              className="flex-1 bg-transparent border-b focus:border-black outline-none px-2 py-1 text-sm transition"
            />

            <button
              onClick={handleComment}
              disabled={loading || !commentText.trim()}
              className="text-black transition disabled:text-gray-400"
            >
              <IoSendSharp className="h-5 w-5" />
            </button>
          </div>

          <div className="w-full max-h-[320px] overflow-y-auto px-4 py-3 space-y-3">
            {post?.comments?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center">
                No comments yet
              </p>
            ) : (
              post?.comments?.map((com) => (
                <div key={com._id} className="flex gap-3 items-start">
                  <img
                    src={com.author.profileImage || dp}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover border"
                  />

                  <div className="flex flex-col">
                    <div className="bg-gray-100 hover:bg-gray-200 transition px-3 py-2 rounded-2xl max-w-[260px]">
                      <span className="text-xs font-semibold mr-2">
                        {com.author?.userName || "user"}
                      </span>

                      <span className="text-sm text-gray-800 break-words">
                        {com.message}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
