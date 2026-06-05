import React, { useEffect, useState } from "react";
import logo from "../assets/logo2.png";
import { FaRegHeart } from "react-icons/fa";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { addNotification, setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import OtherUser from "./OtherUser";
import { FiMessageCircle } from "react-icons/fi";
import SERVER_URL from "../config";

const LeftHome = () => {
  const navigate = useNavigate();
  const [msgCount, setMsgCount] = useState(0);
  const { userData, suggestedUsers } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const { notificationData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      const res = await axios.get("${SERVER_URL}/api/auth/signout", {
        withCredentials: true,
      });
      toast.success(res.data.message);
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Logged out");
    } finally {
      dispatch(setUserData(null));
      localStorage.removeItem("token");
      navigate("/signin");
    }
  };
  useEffect(() => {
    const fetchCount = async () => {
      const res = await axios.get(
        `${SERVER_URL}/api/message/unread-count`,
        { withCredentials: true },
      );
      setMsgCount(res.data.count);
    };

    fetchCount();

    if (!socket) return;

    const handleUpdate = () => {
      console.log("COUNT UPDATE TRIGGERED");
      fetchCount();
    };

    socket.off("updateUnreadCount");
    socket.on("updateUnreadCount", handleUpdate);

    return () => {
      socket.off("updateUnreadCount", handleUpdate);
    };
  }, [socket]);
  useEffect(() => {
    if (!socket) return;

    socket.on("newNotification", (data) => {
      console.log("NEW NOTIFICATION:", data);

      dispatch(addNotification(data));
    });

    return () => {
      socket.off("newNotification");
    };
  }, [socket]);

  return (
    <div className="w-[25%] hidden lg:block h-screen sticky top-0 bg-black border-r border-gray-800">
      <div className="w-full h-[70px] flex items-center justify-between px-4">
        <img src={logo} alt="logo" className="w-[90px] object-contain" />

        <div className="flex items-center gap-5">
          <div className="relative cursor-pointer">
            <FaRegHeart
              className="text-white w-6 h-6 cursor-pointer active:scale-90 transition"
              onClick={() => navigate("/notifications")}
            />

            {notificationData?.length > 0 &&
              notificationData.some((noti) => noti.isRead === false) && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
                  {notificationData.filter((noti) => !noti.isRead).length}
                </span>
              )}
          </div>

          <div className="relative cursor-pointer">
            <FiMessageCircle
              className="text-white w-6 h-6"
              onClick={() => navigate("/message")}
            />

            {msgCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full min-w-[16px] text-center">
                {msgCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-[20px] py-[12px] border-b border-gray-800">
        <div
          className="flex items-center gap-[12px] cursor-pointer"
          onClick={() => navigate(`/profile/${userData.userName}`)}
        >
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer">
            <img
              src={userData?.profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="text-[16px] text-white font-semibold">
              {userData?.userName || "username"}
            </div>
            <div className="text-[14px] text-gray-400">
              {userData?.name || "Name"}
            </div>
          </div>
        </div>

        <div
          className="text-blue-500 text-sm font-semibold cursor-pointer hover:text-blue-400 transition"
          onClick={handleLogOut}
        >
          Logout
        </div>
      </div>

      <div className="w-full flex flex-col gap-[15px] p-[20px]">
        <h1 className="text-gray-400 font-semibold text-[14px]">
          Suggested for you
        </h1>

        <div className="flex flex-col gap-[12px]">
          {suggestedUsers &&
            suggestedUsers
              .slice(0 - 4)
              .map((user, index) => (
                <OtherUser key={index} user={user}></OtherUser>
              ))}
        </div>
      </div>
    </div>
  );
};

export default LeftHome;
