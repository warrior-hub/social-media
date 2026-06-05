import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import dp from "../assets/dp.webp";
const EmptyStoryCard = ({ profileImage }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/upload")}
      className="flex flex-col items-center gap-1 cursor-pointer group"
    >
      <div className="p-[2px] rounded-full bg-gray-700 group-hover:bg-gray-600 transition">
        <div className="bg-black p-[2px] rounded-full relative">
          <div className="w-[65px] h-[65px] rounded-full overflow-hidden">
            <img
              src={profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-[5px] border-2 border-black">
            <FaPlus className="text-white text-[10px]" />
          </div>
        </div>
      </div>
      <p className="text-white text-xs w-[70px] truncate text-center transition">
        {"Your Story"}
      </p>
    </div>
  );
};

export default EmptyStoryCard;
