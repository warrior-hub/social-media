import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setProfileData } from "../redux/userSlice";
import SERVER_URL from "../config";

const useGetProfile = (userName) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${SERVER_URL}/api/user/getProfile/${userName}`,
        { withCredentials: true }
      );

      dispatch(setProfileData(res.data));
    } catch (err) {
      setError(err.response?.data?.message || "Error");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      getProfile()
  }, []);

  return { loading, error, refetch: getProfile };
};

export default useGetProfile;