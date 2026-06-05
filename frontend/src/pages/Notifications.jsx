import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";
import { markAllAsRead } from "../redux/userSlice";
import Nav from "../components/Nav";
import dp from "../assets/dp.webp";
import SERVER_URL from "../config";
const Notifications = () => {
  const { notificationData } = useSelector((state) => state.user);
  const sortedNotifications = [...notificationData].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const markAll = async () => {
      try {
        await axios.put(
        `${SERVER_URL}/api/user/markAllAsRead`,
          {},
          { withCredentials: true },
        );
        dispatch(markAllAsRead());
      } catch (err) {
        console.log(err);
      }
    };

    markAll();
  }, []);
  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">
        <div className="flex items-center gap-3 p-4 sticky top-0 bg-black z-10 border-b border-zinc-800">
          <IoArrowBack
            className="text-2xl cursor-pointer hover:scale-110 transition"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-xl md:text-xl font-semibold">Notifications</h1>
        </div>

        <div className="flex flex-col gap-2  rounded-4xl p-4">
          {sortedNotifications?.length > 0 ? (
            sortedNotifications.map((noti) => (
              <div
                key={noti._id}
                className={`flex items-center gap-4 p-4 rounded-xl text-black transition-all duration-200  ${
                  noti.isRead ? "bg-white" : "bg-zinc-800/80"
                }`}
              >
                <img
                  src={noti.sender?.profileImage || dp}
                  className="w-11 h-11 md:w-12 md:h-12 rounded-full object-cover"
                />

                <div className="flex-1">
                  <p className="text-sm md:text-base">
                    <span className="font-semibold">
                      {noti.sender?.userName}
                    </span>{" "}
                    {noti.message}
                  </p>
                </div>

             {noti.type!="follow"&&   <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-900 flex items-center justify-center">
                  {noti.reel?.media && (
                    <video
                      src={noti.reel?.media}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {noti.post?.media && (
                    <img
                      src={noti.post?.media}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
}
                {!noti.isRead && (
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-[60vh]">
              <p className="text-gray-400 text-lg">No notifications yet</p>
            </div>
          )}
        </div>
      </div>
      <Nav />
    </div>
  );
};

export default Notifications;
