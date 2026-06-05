import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeft, FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import dp from "../assets/dp.webp";
import SERVER_URL from "../config";

const STORY_DURATION = 15000;

const StoryViewer = () => {
  const { userName } = useParams();
  const navigate = useNavigate();

  const [showViewers, setShowViewers] = useState(false);
  const [stories, setStories] = useState([]);
  const [index, setIndex] = useState(0);
  const { userData } = useSelector((state) => state.user);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef(null);

  // FETCH STORIES
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URL}/api/story/getByUserName/${userName}`,
          { withCredentials: true },
        );

        setStories(res.data.stories || []);
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    if (userName) fetchStories();
  }, [userName]);

  useEffect(() => {
    if (!stories.length) return;

    setProgress(0);

    const interval = 50;
    const step = (interval / STORY_DURATION) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [index, stories]);

  const story = stories[index];

  if (!story) return null;

  return (
    <div className="w-full max-w-[420px] h-screen mx-auto relative bg-black overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-800 z-50">
        <div
          className="h-full bg-white transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="absolute top-3 left-3 z-40 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-white">
          <FaArrowLeft />
        </button>

        <img
          src={story.author?.profileImage || dp}
          className="w-9 h-9 rounded-full object-cover border border-gray-600"
          alt=""
        />

        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">
            {story.author?.userName}
          </p>
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        {story.mediaType === "video" ? (
          <video
            src={story.media}
            autoPlay
            muted
            className="w-full h-full object-cover aspect-[9/16]"
          />
        ) : (
          <img
            src={story.media}
            className="w-full h-full object-cover aspect-[9/16]"
            alt=""
          />
        )}
      </div>
      {userData?._id === story.author?._id && (
        <div
          className="absolute bottom-3 right-3 z-40 flex items-center gap-1 text-xs text-gray-300 bg-black/40 px-2 py-1 rounded-full backdrop-blur"
          onClick={() => setShowViewers(true)}
        >
          <FaEye />
          <span>{story.viewers?.length || 0}</span>
        </div>
      )}
      {showViewers && (
        <div
          className="absolute inset-0 bg-black/60 z-50 flex items-end"
          onClick={() => setShowViewers(false)}
        >
          <div
            className="w-full bg-white rounded-t-2xl p-4 max-h-[70%] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">
                Viewers ({story.viewers?.length || 0})
              </h2>

              <button
                onClick={() => setShowViewers(false)}
                className="text-black font-bold text-xl"
              >
                ×
              </button>
            </div>

            {story.viewers?.length > 0 ? (
              story.viewers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 py-2 border-b"
                >
                  <img
                    src={user.profileImage || dp}
                    className="w-10 h-10 rounded-full object-cover"
                    alt=""
                  />

                  <div>
                    <p className="text-sm font-semibold text-black">
                      {user.userName}
                    </p>
                    <p className="text-xs text-gray-500">{user.name || ""}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">No viewers yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;
