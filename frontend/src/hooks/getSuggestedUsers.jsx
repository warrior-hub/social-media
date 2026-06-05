import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUsers } from "../redux/userSlice";
import SERVER_URL from "../config";

function useGetSuggestedUsers() {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URL}/api/user/suggested`,
          { withCredentials: true }
        );

        dispatch(setSuggestedUsers(res.data));
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    if (userData) {
      fetchUser();
    }
  }, [userData, dispatch]);
}

export default useGetSuggestedUsers;