import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaHeart, FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setReelData } from "../redux/reelSlice";
import { IoSend } from "react-icons/io5";
import dp from "../assets/dp.webp";
import SERVER_URL from "../config";
const ReelCard = ({ reel }) => {
  const videoRef = useRef(null);
  const { userData } = useSelector((state) => state.user);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const isLiked = reel?.likes?.includes(userData?._id);
  const [showComments, setShowComments] = useState(false);
  const dispatch = useDispatch();
  const [commentText, setcommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const reelData = useSelector((state) => state.reel.reelData);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(video);

    return () => observer.unobserve(video);
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent || 0);
  };

  const handleLike = async () => {
    if (!userData?._id) return;

    const updatedReels = reelData.map((r) => {
      if (r._id === reel._id) {
        const alreadyLiked = r.likes.some(
          (id) => id.toString() === userData._id,
        );

        return {
          ...r,
          likes: alreadyLiked
            ? r.likes.filter((id) => id.toString() !== userData._id)
            : [...r.likes, userData._id],
        };
      }
      return r;
    });

    dispatch(setReelData(updatedReels));

    try {
      await axios.get(`${SERVER_URL}/api/reel/like/${reel._id}`, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    if (commentLoading) return;

    const text = commentText;
    const tempComment = {
      _id: Date.now().toString(),
      message: text,
      author: {
        _id: userData._id,
        userName: userData.userName,
        profileImage: userData.profileImage,
      },
    };

    const updatedReels = reelData.map((r) => {
      if (r._id === reel._id) {
        return {
          ...r,
          comments: [...(r.comments || []), tempComment],
        };
      }
      return r;
    });

    dispatch(setReelData(updatedReels));
    setcommentText("");
    setCommentLoading(true);

    try {
      const res = await axios.post(
        `${SERVER_URL}/api/reel/comment/${reel._id}`,
        { message: text },
        { withCredentials: true },
      );

      const savedComment = res.data.comment;
      const finalReels = updatedReels.map((r) => {
        if (r._id === reel._id) {
          return {
            ...r,
            comments: r.comments.map((c) =>
              c._id === tempComment._id ? savedComment : c,
            ),
          };
        }
        return r;
      });

      dispatch(setReelData(finalReels));
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div
      className="w-full h-full relative cursor-pointer"
      onClick={handlePlayPause}
    >
      <video
        ref={videoRef}
        src={reel.media}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onTimeUpdate={handleTimeUpdate}
      />

      <div
        onClick={handleToggleMute}
        className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full"
      >
        {isMuted ? (
          <FiVolumeX className="text-white text-xl" />
        ) : (
          <FiVolume2 className="text-white text-xl" />
        )}
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <FaPause className="text-white text-4xl" />
        </div>
      )}

      <div className="absolute bottom-24 right-3 flex flex-col items-center gap-5 text-white">
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          className="flex flex-col items-center"
        >
          {isLiked ? (
            <FaHeart className="text-red-500 text-2xl" />
          ) : (
            <FaRegHeart className="text-2xl" />
          )}
          <span className="text-xs">{reel?.likes?.length || 0}</span>
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowComments(!showComments);
          }}
          className="flex flex-col items-center"
        >
          <FaRegCommentDots className="text-2xl" />
          <span className="text-xs">{reel?.comments?.length || 0}</span>
        </div>
        {/* 
        SAVE
       <div className="text-xl" onClick={()=>handleSaveUnsave(reel._id)}>
                 {!userData?.saved?.includes(reel?._id) ? (
                   <MdOutlineBookmarkBorder className="w-[25px] h-[25px] cursor-pointer" />
                 ) : (
                   <MdOutlineBookmark className="w-[25px] h-[25px] cursor-pointer" />
                 )}
               </div> */}
      </div>
      {showComments && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex justify-center items-end"
          onClick={() => setShowComments(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[500px] h-[70%] bg-white rounded-t-2xl p-4 animate-slideUp flex flex-col"
          >
            <div className="text-center font-semibold mb-2">Comments</div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {(reel.comments || []).map((c, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <img
                    src={c.author.profileImage || dp}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {c.author?.userName}
                    </p>
                    <p className="text-sm">{c.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t pt-2">
              <img
                src={userData?.profileImage || dp}
                className="w-8 h-8 rounded-full"
              />
              <input
                value={commentText}
                onChange={(e) => setcommentText(e.target.value)}
                type="text"
                placeholder="Add a comment..."
                className="flex-1 outline-none text-sm"
              />
              <button
                onClick={handleComment}
                disabled={!commentText}
                className={`text-2xl transition ${
                  commentText ? "text-black" : "text-gray-400"
                }`}
              >
                <IoSend />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-16 left-3 flex items-center gap-3 text-white">
        <img
          src={reel?.author.profileImage||dp}
          className="w-10 h-10 rounded-full border-2 border-white"
        />
        <div>
          <p className="font-semibold text-sm">{reel?.author?.userName}</p>
          <p className="text-xs opacity-80">{reel?.author?.name}</p>
        </div>
       {reel?.author._id!=userData?._id && <FollowButton
          targetUserId={reel?.author?._id}
          className="px-4 py-1.5  backdrop-blur-md text-white text-sm rounded-md border border-white/30 hover:bg-white/30 transition"
        />}
      </div>
      <div className="absolute bottom-5 left-3 text-white text-sm w-[75%]">
        {reel.caption}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-600">
        <div className="h-full bg-white" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ReelCard;
