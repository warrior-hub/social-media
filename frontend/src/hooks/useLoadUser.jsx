import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFollowing, setUserData } from "../redux/userSlice";
import SERVER_URL from "../config";

function useGetCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URL}/api/user/current`,
          { withCredentials: true }
        );

        const user = res.data.user || res.data;

        dispatch(setUserData(user));
         setFollowing(user.following.map(u => u._id));
        } catch (error) {
        console.log(error.response?.data);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);
}

export default useGetCurrentUser;