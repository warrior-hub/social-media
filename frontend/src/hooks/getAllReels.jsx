import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReelData } from "../redux/reelSlice";
import SERVER_URL from "../config";

function useGetAllReels() {
  const dispatch = useDispatch();
  const reelData = useSelector((state) => state.reel.reelData||[]);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URL}/api/reel/getAll`,
          { withCredentials: true }
        );

        dispatch(setReelData(res.data.reels));
      } catch (error) {
        console.log(error.response?.data);
      }
    };
    if (!reelData || reelData.length === 0) {
      fetchReels();
    }
  }, []);
}

export default useGetAllReels;