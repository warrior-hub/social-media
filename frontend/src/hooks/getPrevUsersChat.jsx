import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setPrevChatUsers } from "../redux/messageSlice";
import SERVER_URL from "../config";

const usePrevUserChat = () => {
  const dispatch = useDispatch();
  const {messages} =useSelector(state=>state.message)
  const getPrevChats = async () => {
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/message/prevChats`,
        { withCredentials: true }
      );

      dispatch(setPrevChatUsers(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPrevChats();
  }, [messages]);

  return { refetch: getPrevChats };
};

export default usePrevUserChat;