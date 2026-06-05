import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setProfileData, setUserData } from "../redux/userSlice";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { toast } from "react-toastify";
import dp from "../assets/dp.webp";
import Nav from "../components/Nav";
import FollowButton from "../components/FollowButton";
import Post from "../components/Post";
import { setSelectedUser } from "../redux/messageSlice";
import SERVER_URL from "../config";

const Profile = () => {
  const navigate = useNavigate();
  const { userName } = useParams();
  const dispatch = useDispatch();
  const [type, settype] = useState("post");

  const { profileData, userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);

  const handleProfile = async () => {
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/user/getProfile/${userName}`,
        { withCredentials: true },
      );

      dispatch(setProfileData(res.data));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to load profile");
    }
  };

  useEffect(() => {
    if (userName) {
      handleProfile();
    }
  }, [userName]);

  const handleLogOut = async () => {
    try {
      const res = await axios.get("${SERVER_URL}/api/auth/signout", {
        withCredentials: true,
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logged out");
    } finally {
      dispatch(setUserData(null));
      localStorage.removeItem("token");
      navigate("/signin");
    }
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="flex w-full h-[70px] justify-between items-center px-[20px] text-white border-b border-gray-800">
        <MdOutlineKeyboardBackspace
          className="w-[24px] h-[24px] cursor-pointer"
          onClick={() => navigate(-1)}
        />

        <div className="font-semibold text-[18px]">{profileData?.userName}</div>

        <div
          className="font-semibold cursor-pointer text-[14px] text-blue-500 hover:text-blue-400"
          onClick={handleLogOut}
        >
          Log Out
        </div>
      </div>

      <div className="flex items-center justify-center gap-[20px] px-[20px] mt-[20px]">
        <div className="w-[80px] h-[80px] md:w-[110px] md:h-[110px] rounded-full overflow-hidden border-2 border-gray-600">
          <img
            src={profileData?.profileImage || dp}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-[4px]">
          <div className="text-white text-[18px] font-semibold">
            {profileData?.name || "User"}
          </div>

          <div className="text-gray-400 text-[14px]">
            {profileData?.profession || "New User"}
          </div>

          <div className="text-gray-400 text-[14px] max-w-[220px]">
            {profileData?.bio || ""}
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[30px] text-white">
        <div className="text-center">
          <div className="text-[22px] md:text-[30px] font-semibold">
            {profileData?.posts?.length || 0}
          </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffc7]">Posts</div>
        </div>

        <div className="text-center">
          <div className="text-[22px] md:text-[30px] font-semibold">
            {profileData?.followers?.length || 0}
          </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffc7]">
            Followers
          </div>
        </div>

        <div className="text-center">
          <div className="text-[22px] md:text-[30px] font-semibold">
            {profileData?.following?.length || 0}
          </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffc7]">
            Following
          </div>
        </div>
      </div>

      <div className="w-full h-[80px] flex justify-center items-center gap-[20px] mt-[10px] ">
        {profileData && userData && profileData._id === userData._id && (
          <button
            className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white rounded-2xl"
            onClick={() => navigate("/editprofile")}
          >
            Edit Profile
          </button>
        )}

        {profileData && userData && profileData._id !== userData._id && (
          <>
            <FollowButton
              className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white rounded-2xl"
              targetUserId={profileData?._id}
              onFollowChange={handleProfile}
            />

            <button
              className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white rounded-[5px]"
              onClick={() => {
                dispatch(setSelectedUser(profileData));
                navigate("/message");
              }}
            >
              Message
            </button>
          </>
        )}
      </div>

      <div className="w-full min-h-[100vh] flex justify-center">
        <div className="w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white gap-[20px] pt-[30px]">
          <Nav />

          <div className="w-full flex justify-center gap-6">
            <div
              className={`w-[120px] h-[45px] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer
              ${type === "post" ? "bg-black text-white" : "hover:bg-black hover:text-white"}`}
              onClick={() => settype("post")}
            >
              Posts
            </div>

            {profileData && userData && profileData._id === userData._id && (
              <div
                className={`w-[120px] h-[45px] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer
                ${type === "saved" ? "bg-black text-white" : "hover:bg-black hover:text-white"}`}
                onClick={() => settype("saved")}
              >
                Saved
              </div>
            )}
          </div>

          {type === "post" &&
            postData?.posts?.length > 0 &&
            postData.posts
              .filter((post) => post?.author?._id === profileData?._id)
              .map((post) => <Post post={post} key={post._id} />)}

          {type === "saved" &&
            postData?.posts?.map((post, index) =>
              userData?.saved?.includes(post._id) ? (
                <Post post={post} key={index} />
              ) : null,
            )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
