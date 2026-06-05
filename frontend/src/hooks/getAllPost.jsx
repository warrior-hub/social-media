import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPostData } from "../redux/postSlice";
import SERVER_URL from "../config";

function useGetAllPost() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URL}/api/post/getAll`,
          { withCredentials: true }
        );

        dispatch(setPostData(res.data));
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    fetchUser();
  }, [dispatch]);
}

export default useGetAllPost;