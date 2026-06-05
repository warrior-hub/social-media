import React from "react";
import ChatList from "../components/ChatList";
import ChatScreen from "../components/ChatScreen";
import { useSelector } from "react-redux";
import { FiMessageSquare } from "react-icons/fi";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const MessagePage = () => {
  const { selectedUser } = useSelector((state) => state.message);

  return (
    <div className="w-full h-screen flex bg-black">
      <div className="w-full lg:hidden">
        {!selectedUser ? (
          <ChatList />
        ) : (
          <div className="flex flex-col h-full">
            <ChatScreen />
          </div>
        )}
      </div>

      <div className="hidden lg:flex w-full">
        <div className="w-[30%] border-r border-gray-800">
          <ChatList />
        </div>

        <div className="w-[70%] flex items-center justify-center">
          {selectedUser ? (
            <ChatScreen />
          ) : (
            <div className="flex flex-col items-center text-center text-white">
              <div className="w-20 h-20 flex items-center justify-center rounded-full border border-gray-600 mb-4">
                <FiMessageSquare size={32} />
              </div>

              <h2 className="text-xl font-semibold mb-2">Your Messages</h2>

              <p className="text-gray-400 text-sm max-w-xs">
                Send private photos and messages to friends.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
