import React, { useState } from "react";
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import SERVER_URL from "../config";
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const [formData, setformData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
  });

  function onChange(e) {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSignup(e) {
    e.preventDefault();
    console.log(formData);
    try {
      setloading(true);
      const res = await axios.post(
      `${SERVER_URL}/api/auth/signup`,
        formData,
        {
          withCredentials: true,
        },
      );
      dispatch(setUserData(res.data.user));  
      toast.success(res.data.message);
      setloading(false);
      setformData({ name: "", userName: "", email: "", password: "" });
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data.message);
      setloading(false);
    }
  }
  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex justify-center items-center">
      <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex overflow-hidden border-2 border-[#1a1f23]">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-[50%] h-full flex flex-col items-center justify-start px-[25px] py-[20px] gap-[15px]">
          <div className="flex gap-[10px] items-center text-[22px] font-semibold mt-[10px] mb-6">
            <span>Sign Up to</span>
            <img src={logo} alt="" className="w-[70px]" />
          </div>

     
          <div className="relative w-full h-[50px] border-2 border-gray-300 rounded-xl px-[10px]">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder=" "
              required
              className="peer w-full h-full outline-none bg-transparent"
            />
            <label
              htmlFor="name"
              className="absolute left-[10px] top-[12px] text-gray-500 text-[14px] transition-all duration-200 
              peer-focus:top-[-10px] peer-focus:text-[12px]
              peer-valid:top-[-10px] peer-valid:text-[12px]
              bg-white px-[4px]"
            >
              Full Name
            </label>
          </div>

        
          <div className="relative w-full h-[50px] border-2 border-gray-300 rounded-xl px-[10px]">
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={onChange}
              placeholder=" "
              required
              className="peer w-full h-full outline-none bg-transparent"
            />
            <label
              htmlFor="userName"
              className="absolute left-[10px] top-[12px] text-gray-500 text-[14px] transition-all duration-200 
              peer-focus:top-[-10px] peer-focus:text-[12px]
              peer-valid:top-[-10px] peer-valid:text-[12px]
              bg-white px-[4px]"
            >
              Username
            </label>
          </div>

         
          <div className="relative w-full h-[50px] border-2 border-gray-300 rounded-xl px-[10px]">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder=" "
              required
              className="peer w-full h-full outline-none bg-transparent"
            />
            <label
              htmlFor="email"
              className="absolute left-[10px] top-[12px] text-gray-500 text-[14px] transition-all duration-200 
              peer-focus:top-[-10px] peer-focus:text-[12px]
              peer-valid:top-[-10px] peer-valid:text-[12px]
              bg-white px-[4px]"
            >
              Email Address
            </label>
          </div>

          <div className="relative w-full h-[50px] border-2 border-gray-300 rounded-xl px-[10px] flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder=" "
              required
              className="peer w-full h-full outline-none bg-transparent pr-[30px]"
            />

            <label
              htmlFor="password"
              className="absolute left-[10px] top-[12px] text-gray-500 text-[14px] transition-all duration-200 
              peer-focus:top-[-10px] peer-focus:text-[12px]
              peer-valid:top-[-10px] peer-valid:text-[12px]
              bg-white px-[4px]"
            >
              Password
            </label>

            <span
              className="absolute right-[10px] cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

       
          <button
            className="h-[45px] bg-black text-white rounded-xl mt-[10px] w-full hover:bg-gray-800 transition-all cursor-pointer"
            onClick={handleSignup}
            disabled={loading == true}
          >
            {loading ? (
              <ClipLoader size={30} color="white" />
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-gray-500 text-center text-[14px] px-[10px]">
            Already have an account?{" "}
            <a href="/signin" className="text-black font-semibold underline">
              Sign In
            </a>
          </p>
        </div>

        <div className="hidden lg:flex w-[50%] h-full bg-black rounded-l-[30px] flex-col justify-center items-center gap-[10px]">
          <img src={logo2} alt="" className="w-[200px]" />
          <p className="text-white text-center font-bold">
            Not just a platform, it's a vybe
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
