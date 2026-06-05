import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../redux/messageSlice";
import dp from "../assets/dp.webp";

const ChatList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { prevChatUsers } = useSelector((state) => state.message);
  const { onlineUsers } = useSelector((state) => state.socket);

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      <div className="h-[60px] flex items-center gap-4 px-4 border-b border-gray-800">
        <MdOutlineKeyboardBackspace
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <h1 className="text-lg font-semibold">Messages</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!prevChatUsers || prevChatUsers.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No chats yet</p>
        ) : (
          prevChatUsers.map((chat) => {
            const user = chat.user;
            const isOnline = onlineUsers?.includes(user?._id);
            const hasUnseen = chat.unseenCount > 0;

            return (
              <div
                key={chat._id}
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  navigate("/message");
                }}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition
                  hover:bg-gray-900
                  ${hasUnseen ? "bg-gray-900/40" : ""}
                `}
              >
                <div className="relative w-[45px] h-[45px]">
                  <img
                    src={user?.profileImage || dp}
                    className="w-full h-full rounded-full object-cover"
                  />

                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{user?.userName}</p>
                  </div>

                  <p
                    className={`text-sm truncate max-w-[250px]
                      ${hasUnseen ? "text-white font-semibold" : "text-gray-400"}
                    `}
                  >
                    {chat?.lastMessage || "Start chatting..."}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;
