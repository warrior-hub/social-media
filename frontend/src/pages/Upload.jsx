import React, { useRef, useState } from "react";
import { FiPlusSquare } from "react-icons/fi";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { setReelData } from "../redux/reelSlice";
import { ClipLoader } from "react-spinners";
import { setStoryData } from "../redux/storySlice";
import Nav from "../components/Nav";
import SERVER_URL from "../config";

const Upload = () => {
  const navigate = useNavigate();
  const [uploadType, setuploadType] = useState("post");
  const [frontendMedia, setfrontendMedia] = useState("");
  const [backendMedia, setbackendMedia] = useState("");
  const [caption, setcaption] = useState("");
  const [mediaType, setmediaType] = useState("");
  const [loading, setloading] = useState(false);
  const mediaInput = useRef();
  const dispatch = useDispatch();
  const postData = useSelector((state) => state.post.postData.posts || []);
  const { storyData } = useSelector((state) => state.story);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.includes("image")) {
        setmediaType("image");
      } else {
        setmediaType("video");
      }
      setbackendMedia(file);
      setfrontendMedia(URL.createObjectURL(file));
    }
  };

  const uploadPost = async () => {
    setloading(true);
    try {
      if (!backendMedia) {
        toast.error("Please select media");
        return;
      }

      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);
      const res = await axios.post(
        `${SERVER_URL}/api/post/upload`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(res.data.post);
      dispatch(setPostData([...(postData || []), res.data.post]));
      toast.success(res.data.message);
      setloading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Upload failed");
      setloading(false);
    }
  };

  const uploadStroy = async () => {
    setloading(true);
    try {
      const formData = new FormData();
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const res = await axios.post(
        `${SERVER_URL}/api/story/upload`,
        formData,
        { withCredentials: true },
      );
      console.log(res);
      dispatch(
        setStoryData(
          (storyData || []).map((s) =>
            s?.author?._id === res.data.story.author._id ? res.data.story : s,
          ),
        ),
      );
      toast.success(res.data.message);
      setloading(false);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data.message || "Uploaded failed");
      console.log(error);
      setloading(false);
    }
  };

  const uploadReel = async () => {
    if (!backendMedia) {
      toast.error("Please select a video");
      return;
    }

    setloading(true);

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("media", backendMedia);
      console.log(backendMedia);
      const res = await axios.post(
        `${SERVER_URL}/api/reel/upload`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(res);

      //  safer redux update
      dispatch(setReelData((prev) => [...prev, res.data.reel]));

      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload Failed");
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const handleUpload = () => {
    if (uploadType == "post") {
      uploadPost();
    } else if (uploadType == "story") {
      uploadStroy();
    } else {
      uploadReel();
    }
  };

  return (
    <div className="bg-black w-full min-h-screen flex flex-col items-center p-[10px]">
      {/* Header */}
      <div className="w-full flex items-center gap-4 px-4">
        <MdOutlineKeyboardBackspace
          className="w-6 h-6 cursor-pointer text-white"
          onClick={() => navigate(`/`)}
        />
        <h1 className="text-lg sm:text-xl font-bold text-white">
          Upload Media
        </h1>
      </div>

      <input
        type="file"
        hidden
        ref={mediaInput}
        accept={uploadType === "reel" ? "video/*" : "image/*,video/*"}
        onChange={handleFileChange}
      />

      <div className="w-[80%] max-w-[600px] h-[80px] bg-white rounded-full flex justify-around items-center gap-[10px] mt-6">
        <div
          className={`w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer transition-all duration-200
      ${
        uploadType === "post"
          ? "bg-black text-white shadow-2xl shadow-black"
          : "hover:bg-black hover:text-white hover:shadow-2xl hover:shadow-black"
      }`}
          onClick={() => {
            setuploadType("post");
            setfrontendMedia(null);
            setmediaType("");
          }}
        >
          Post
        </div>

        <div
          className={`w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer transition-all duration-200
      ${
        uploadType === "story"
          ? "bg-black text-white shadow-2xl shadow-black"
          : "hover:bg-black hover:text-white hover:shadow-2xl hover:shadow-black"
      }`}
          onClick={() => {
            setuploadType("story");
            setfrontendMedia(null);
            setmediaType("");
          }}
        >
          Story
        </div>

        <div
          className={`w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer transition-all duration-200
      ${
        uploadType === "reel"
          ? "bg-black text-white shadow-2xl shadow-black"
          : "hover:bg-black hover:text-white hover:shadow-2xl hover:shadow-black"
      }`}
          onClick={() => {
            setuploadType("reel");
            setfrontendMedia(null);
            setmediaType("");
          }}
        >
          Reels
        </div>
      </div>

      {!frontendMedia && (
        <div
          className="w-full max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-[8px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d] text-white overflow-hidden"
          onClick={() => mediaInput.current.click()}
        >
          <FiPlusSquare className="w-[25px] h-[25px]" />
          <div>
            {uploadType === "reel"
              ? "Upload Video Reel"
              : `Upload ${uploadType}`}
          </div>
        </div>
      )}

      {frontendMedia && (
        <div className="w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]">
          {mediaType === "image" && (
            <div className="w-[80%] max-w-[500px] flex flex-col items-center mt-[15vh] gap-4">
              <img
                src={frontendMedia}
                alt=""
                className="min-h-[300px] max-h-[400px] w-auto rounded-2xl object-contain"
              />

              {uploadType !== "story" && (
                <input
                  type="text"
                  className="w-full border-b border-gray-400 outline-none px-[10px] py-[5px] text-white bg-transparent"
                  placeholder="Write caption"
                />
              )}
            </div>
          )}

          {mediaType === "video" && (
            <div className="w-[80%] max-w-[500px] max-h-[50vh] flex flex-col items-center justify-center mt-[15vh]">
              <VideoPlayer media={frontendMedia} />

              {uploadType !== "story" && (
                <input
                  type="text"
                  className="w-full border-b border-gray-400 outline-none px-[10px] py-[5px] text-white mt-[20px] bg-transparent"
                  placeholder="Write caption"
                  value={caption}
                  onChange={(e) => setcaption(e.target.value)}
                />
              )}
            </div>
          )}

          <button
            className="px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-[white] mt-[50px] cursor-pointer rounded-2xl"
            onClick={handleUpload}
          >
            {loading ? (
              <ClipLoader color="black" size={30} />
            ) : (
              `Upload ${uploadType}`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Upload;
