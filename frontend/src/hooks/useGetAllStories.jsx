import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setStoryData } from "../redux/storySlice";
import SERVER_URL from "../config";

const useGetAllStories = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URL}/api/story/all`,
          { withCredentials: true }
        );

        dispatch(setStoryData(res.data.stories));

        console.log("Stories:", res.data.stories);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    fetchStories();
  }, [dispatch]);
};

export default useGetAllStories;