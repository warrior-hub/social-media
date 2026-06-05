import { useDispatch, useSelector } from "react-redux";
import { FiSend, FiImage, FiX } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  addMessage,
  setMessages,
  setSelectedUser,
} from "../redux/messageSlice";
import dp from "../assets/dp.webp";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import SERVER_URL from "../config";
const ChatScreen = () => {
  const { selectedUser, messages } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const messagesEndRef = useRef(null);
  const imageInput = useRef();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log("Selected file:", file);
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };
  const removeImage = () => {
    setFrontendImage(null);
    setBackendImage(null);
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim() && !backendImage) return;

    try {
      const formData = new FormData();

      if (input.trim()) {
        formData.append("message", input);
      }

      if (backendImage) {
        formData.append("image", backendImage);
      }

      console.log("Sending:", { input, backendImage });

      const res = await axios.post(
        `${SERVER_URL}/api/message/send/${selectedUser._id}`,
        formData,
        {
          withCredentials: true,
        },
      );

      dispatch(addMessage(res.data.message));

      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log("Send error:", error.response?.data || error.message);
    }
  };
  const getMessages = async () => {
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/message/getAll/${selectedUser._id}`,
        {
          withCredentials: true,
        },
      );

      console.log("All messages:", res.data);
      dispatch(setMessages(res.data || []));
    } catch (error) {
      console.log("Get messages error:", error.response?.data || error.message);
      dispatch(setMessages([]));
    }
  };

  useEffect(() => {
    getMessages();
  }, [selectedUser]);

  useEffect(() => {
    socket?.on("newMessage", (msg) => {
      dispatch(setMessages([...messages, msg]));
    });

    return () => socket.off("newMessage");
  }, [messages, setMessages]);

  useEffect(() => {
    if (!selectedUser?._id) return;

    axios.put(
      `${SERVER_URL}/api/message/seen/${selectedUser._id}`,
      {},
      { withCredentials: true },
    );
  }, [selectedUser]);
  return (
    <div className="w-full h-[100vh] bg-black flex flex-col">
      <div className="flex items-center gap-3 px-4 h-[60px] border-b border-gray-800">
        <MdOutlineKeyboardBackspace
          className="text-white w-6 h-6 cursor-pointer lg:hidden"
          onClick={() => dispatch(setSelectedUser(null))}
        />

        <img
          src={selectedUser?.profileImage || dp}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex flex-col leading-tight">
          <p className="font-semibold text-white text-sm">
            {selectedUser?.userName}
          </p>

          <p className="text-gray-400 text-xs">{selectedUser?.name}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-[110px] flex flex-col gap-4">
        {messages?.map((msg) => {
          const isMe =
            msg.sender?._id?.toString() === userData?._id?.toString() ||
            msg.sender?.toString() === userData?._id?.toString();
          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <img
                  src={selectedUser?.profileImage || dp}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}

              <div
                className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm relative ${
                  isMe
                    ? "bg-white text-black rounded-br-none"
                    : "bg-[#1a1a1a] text-white rounded-bl-none border border-gray-700"
                }`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="msg"
                    className="rounded-lg mb-2 max-h-[250px] object-cover"
                  />
                )}

                {msg.message && <p>{msg.message}</p>}
              </div>

              {isMe && (
                <img
                  src={userData?.profileImage || dp}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="w-full lg:w-[70%] fixed bottom-0 bg-black px-3 py-2 ">
        <form
          onSubmit={handleSendMessage}
          className="w-full max-w-[800px] mx-auto flex items-center bg-[#1a1a1a] rounded-full px-3 py-2 gap-2 relative"
        >
          {frontendImage && (
            <div className="absolute -top-16 left-3">
              <div className="relative">
                <img
                  src={frontendImage}
                  className="w-15 h-15 object-cover rounded-lg border border-gray-600"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 text-xs"
                >
                  <FiX size={12} />
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => imageInput.current.click()}
            className="flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
          >
            <FiImage size={18} />
          </button>

          <input
            type="file"
            ref={imageInput}
            onChange={handleImage}
            className="hidden"
            accept="image/*"
          />

          <input
            type="text"
            placeholder="Message..."
            className="flex-1 bg-transparent text-white outline-none text-sm px-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {(input || frontendImage) && (
            <button
              type="submit"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-black hover:scale-105 transition"
            >
              <FiSend size={16} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatScreen;
