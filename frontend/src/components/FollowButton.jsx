import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {  toggleFollow, updateUserFollowing } from "../redux/userSlice";
import SERVER_URL from "../config";

const FollowButton = ({ className = "", targetUserId, children,onFollowChange }) => {
   const {userData} =useSelector((state)=>state.user)
  const isFollowing = (userData?.following || []).some(
  (user) => user?._id?.toString() === targetUserId
);
  const dispatch = useDispatch();

  const handleFollow = async () => {
    try {
        
      const res = await axios.get(
        `${SERVER_URL}/api/user/follow/${targetUserId}`,
        { withCredentials: true },
      );

      dispatch(toggleFollow(targetUserId));
      dispatch(updateUserFollowing(targetUserId));
      if (onFollowChange) {
        onFollowChange();
      }

      console.log(res.data.message);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <button
      className={`transition rounded-md cursor-pointer ${className}`}
      onClick={handleFollow}
    >
      {children ? children : isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
