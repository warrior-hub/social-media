import React, { useRef, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import dp from "../assets/dp.webp";
import axios from "axios";
import { setProfileData, setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import SERVER_URL from "../config";
const EditProfile = () => {
  const navigate = useNavigate();
  const imageInput = useRef();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const [frontendImage, setfrontendImage] = useState(
    userData?.profileImage || dp,
  );
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    username: userData?.userName || "",
    bio: userData?.bio || "",
    profession: userData?.profession || "",
    gender: userData?.gender || "",
  });
  const [backendImage, setbackendImage] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setbackendImage(file);
    setfrontendImage(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setloading(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("userName", formData.username);
      data.append("bio", formData.bio);
      data.append("profession", formData.profession);
      data.append("gender", formData.gender);

      if (backendImage) {
        data.append("profileImage", backendImage);
      }

      const res = await axios.post(
        `${SERVER_URL}/api/user/editprofile`,
        data,
        {
          withCredentials: true,
        },
      );

      dispatch(setProfileData(res.data.user));
      dispatch(setUserData(res.data.user));
      toast.success(res.data.message);
      navigate(`/profile/${formData.username}`);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };
  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center gap-6 px-4 py-4 text-white">
      <div className="w-full max-w-[600px] flex items-center gap-4">
        <MdOutlineKeyboardBackspace
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate(`/profile/${userData.userName}`)}
        />
        <h1 className="text-lg sm:text-xl font-semibold">Edit Profile</h1>
      </div>

      <div
        className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] rounded-full overflow-hidden border-2 border-gray-600"
        onClick={() => imageInput.current.click()}
      >
        <input
          type="file"
          accept="image/*"
          ref={imageInput}
          hidden
          onChange={handleChange}
        />
        <img
          src={frontendImage}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>

      <div
        className="text-blue-500 text-sm sm:text-base font-semibold text-center cursor-pointer"
        onClick={() => imageInput.current.click()}
      >
        Change Profile Picture
      </div>

      <div className="w-full max-w-[600px] flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full h-[50px] sm:h-[55px] bg-[#0a1010] border-2 border-gray-700 rounded-xl outline-none px-4 text-white focus:border-gray-500"
          placeholder="Enter Your Name"
        />

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="w-full h-[50px] sm:h-[55px] bg-[#0a1010] border-2 border-gray-700 rounded-xl outline-none px-4 text-white focus:border-gray-500"
          placeholder="Username"
        />

        <input
          type="text"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          className="w-full h-[50px] sm:h-[55px] bg-[#0a1010] border-2 border-gray-700 rounded-xl outline-none px-4 text-white focus:border-gray-500"
          placeholder="Enter Your Bio"
        />

        <input
          type="text"
          name="profession"
          value={formData.profession}
          onChange={handleInputChange}
          className="w-full h-[50px] sm:h-[55px] bg-[#0a1010] border-2 border-gray-700 rounded-xl outline-none px-4 text-white focus:border-gray-500"
          placeholder="Profession"
        />

        <input
          type="text"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className="w-full h-[50px] sm:h-[55px] bg-[#0a1010] border-2 border-gray-700 rounded-xl outline-none px-4 text-white focus:border-gray-500"
          placeholder="Gender"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full max-w-[400px] h-[50px] bg-white text-black rounded-xl cursor-pointer hover:bg-gray-200 transition"
      >
        {loading ? <ClipLoader size={30} color="white" /> : "Save Profile"}
      </button>
    </div>
  );
};

export default EditProfile;
