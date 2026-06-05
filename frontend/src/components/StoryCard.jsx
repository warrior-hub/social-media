import React from "react";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import SERVER_URL from "../config";

const StoryCard = ({ profileImage, userName, storyId }) => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const handleViewStory = async () => {
    try {
      console.log(storyId);

      if (!storyId) return;
      console.log(storyId);

      await axios.post(
        `${SERVER_URL}/api/story/view/${storyId}`,
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const handleClick = async () => {
    handleViewStory();
    navigate(`/story/${userName}`);
  };

  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer">
      <div
        className="p-[2px] rounded-full bg-gradient-to-b from-blue-400 to-blue-950"
        onClick={handleClick}
      >
        <div className="bg-black p-[2px] rounded-full">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
            <img
              src={profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <p className="text-white text-xs w-[70px] truncate text-center">
        {userData?.userName === userName ? "Your Story" : userName}
      </p>
    </div>
  );
};

export default StoryCard;
