import React from "react";

import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton";
const OtherUser = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[80px] flex items-center justify-between border-b-2 border-gray-800">
      <div className="flex items-center gap-[12px]">
        <div
          className="w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer"
          onClick={() => navigate(`/profile/${user.userName}`)}
        >
          <img
            src={user?.profileImage || dp}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div
            className="text-[16px] text-white font-semibold cursor-pointer"
            onClick={() => navigate(`/profile/${user.userName}`)}
          >
            {user?.userName || "username"}
          </div>
          <div className="text-[14px] text-gray-400">
            {user?.name || "Name"}
          </div>
        </div>
      </div>
      <FollowButton
        className={
          "px-4 py-1.5 bg-white text-black text-sm  rounded-md hover:bg-gray-200 transition"
        }
        targetUserId={user._id}
      ></FollowButton>
      {/* <button className="px-4 py-1.5 bg-white text-black text-sm  rounded-md hover:bg-gray-200 transition">
        Follow
      </button> */}
    </div>
  );
};

export default OtherUser;
