import axios from "axios";
import { useDispatch } from "react-redux";
import { setNotificationData } from "../redux/userSlice";
import { useEffect } from "react";
import SERVER_URL from "../config";

function useGetAllNotifications() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URL}/api/user/getAllNotifications`,
          { withCredentials: true }
        );

        dispatch(setNotificationData(res.data));
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    fetchNotifications(); 
  }, []);
}

export default useGetAllNotifications;