import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchData } from "../redux/userSlice";
import dp from "../assets/dp.webp";
import Nav from "../components/Nav";
import SERVER_URL from "../config";
const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const searchData = useSelector((state) => state.user.searchData);
  const handleSearch = async (keyword) => {
    try {
      if (!keyword) {
        dispatch(setSearchData([]));
        return;
      }
      const res = await axios.get(
        `${SERVER_URL}/api/user/search?keyword=${keyword}`,
        { withCredentials: true },
      );
      console.log(res.data);

      dispatch(setSearchData(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      handleSearch(input);
    }, 400);

    return () => clearTimeout(delay);
  }, [input]);

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center px-4 py-4">
      <MdOutlineKeyboardBackspace
        className="w-7 h-7 cursor-pointer hover:opacity-70 fixed left-5 top-5"
        onClick={() => navigate("/")}
      />

      <div className="w-full max-w-[600px] mt-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(input);
          }}
          className="flex items-center bg-white rounded-full px-4 py-3 shadow-md"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search users..."
            className="flex-1 outline-none bg-transparent text-black placeholder-gray-500"
          />

          <button
            type="submit"
            className="bg-black text-white px-5 py-2 rounded-full hover:opacity-80 transition"
          >
            Search
          </button>
        </form>
      </div>

      <div className="w-full max-w-[600px] mt-6 flex flex-col gap-3">
        {searchData && searchData.length > 0
          ? searchData.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 bg-white text-black p-3 rounded-xl shadow-md hover:bg-gray-100 transition cursor-pointer"
                onClick={() => navigate(`/profile/${user.userName}`)}
              >
                <img
                  src={user.profileImage || dp}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover border"
                />

                <div className="flex flex-col">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-sm text-gray-600">
                    @{user.userName}
                  </span>
                  {user.bio && (
                    <span className="text-xs text-gray-500 line-clamp-1">
                      {user.bio}
                    </span>
                  )}
                </div>
              </div>
            ))
          : input && (
              <div className="mt-8 flex flex-col items-center justify-center text-center text-gray-400">
                <h2 className="text-gray-400 text-xl font-bold">
                  No users found
                </h2>
              </div>
            )}
      </div>
      <Nav />
    </div>
  );
};

export default Search;
