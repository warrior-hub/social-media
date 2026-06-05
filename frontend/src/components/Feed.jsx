import React, { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import logo from "../assets/logo2.png";
import StoryCard from "./StoryCard";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import Post from "./Post";
import LeftHome from "./LeftHome";
import RightHome from "./RightHome";
import EmptyStoryCard from "./EmptyStoryCard";
import { FiMessageCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dp from "../assets/dp.webp";
import SERVER_URL from "../config";
const Feed = () => {
  const navigate = useNavigate();
  const { postData } = useSelector((state) => state.post);
  const { userData } = useSelector((state) => state.user);
  const [msgCount, setMsgCount] = useState(0);
  const { storyData } = useSelector((state) => state.story);
  const { socket } = useSelector((state) => state.socket);
  const { notificationData } = useSelector((state) => state.user);
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
  return (
    <div className="lg:w-[50%] w-full bg-black min-h-screen lg:h-screen relative overflow-y-auto">
      <div className="w-full h-[70px] flex items-center justify-between px-4 lg:hidden">
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

      <div className="flex w-full overflow-x-auto gap-[10px] items-center p-[20px] scrollbar-hide">
        {(() => {
          const myStory = storyData?.find(
            (s) => s.user.userName === userData?.userName,
          );

          return (
            <div key="my-story">
              {myStory ? (
                myStory.stories.map((s) => (
                  <StoryCard
                    key={s._id}
                    storyId={s._id}
                    userName={myStory.user.userName}
                    profileImage={myStory.user.profileImage || dp}
                  />
                ))
              ) : (
                <EmptyStoryCard
                  storyId={userData?._id}
                  userName={userData?.userName}
                  profileImage={userData?.profileImage || dp}
                />
              )}
            </div>
          );
        })()}

        {storyData
          ?.filter((story) => story.user.userName !== userData?.userName)
          .map((story) =>
            story.stories.map((s) => (
              <StoryCard
                key={s._id}
                storyId={s._id}
                userName={story.user.userName}
                profileImage={story.user.profileImage || dp}
              />
            )),
          )}
      </div>

      <div className="w-full min-h-screen flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-gray-100 rounded-t-[60px] relative pb-[120px]">
        <Nav />

        {postData?.posts?.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
