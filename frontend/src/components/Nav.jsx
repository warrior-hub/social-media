import React from "react";
import { MdHomeFilled } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { RxVideo } from "react-icons/rx";
import { FiPlusSquare } from "react-icons/fi";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Nav = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="w-full flex justify-center fixed bottom-[15px] z-[100]">
      <div className="w-[95%] lg:w-[40%] h-[65px] bg-black border border-gray-800 flex justify-around items-center rounded-full shadow-lg">
        <MdHomeFilled
          className="text-white w-6 h-6 cursor-pointer hover:scale-110 transition"
          onClick={() => navigate("/")}
        />

        <IoSearchSharp
          className="text-white w-6 h-6 cursor-pointer hover:scale-110 transition"
          onClick={() => navigate("/search")}
        />

        <FiPlusSquare
          className="text-white w-6 h-6 cursor-pointer hover:scale-110 transition"
          onClick={() => navigate("/upload")}
        />

        <RxVideo
          className="text-white w-6 h-6 cursor-pointer hover:scale-110 transition"
          onClick={() => navigate("/reels")}
        />

        <div
          className="w-[35px] h-[35px] rounded-full overflow-hidden cursor-pointer border-2 border-gray-600 hover:scale-110 transition"
          onClick={() => navigate(`/profile/${userData?.userName}`)}
        >
          <img
            src={userData?.profileImage || dp}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Nav;
