import React, { useState } from "react";
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SERVER_URL from "../config";

const VerifyOtp = () => {
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    email: "",
    otp: "",
  });

  function onChange(e) {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setloading(true);

    try {
      const res = await axios.post(
        `${SERVER_URL}/api/auth/verify-otp`,
        formData,
      );

      console.log(res.data);
      toast.success(res.data.message);
      setloading(false);
      navigate("/reset-password");
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data.message);
      setloading(false);
    }
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex justify-center items-center">
      <div className="w-[90%] lg:max-w-[60%] h-[500px] bg-white rounded-2xl flex overflow-hidden border-2 border-[#1a1f23]">
        <div className="w-full lg:w-[50%] flex flex-col items-center justify-center px-[25px] gap-[20px]">
          <div className="flex gap-[10px] items-center text-[22px] font-semibold mb-4">
            <span>Verify OTP</span>
            <img src={logo} alt="" className="w-[70px]" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-[15px]"
          >
            <div className="relative w-full h-[50px] border-2 border-gray-300 rounded-xl px-[10px]">
              <input
                type="text"
                value={formData.otp}
                onChange={onChange}
                name="otp"
                placeholder=" "
                required
                className="peer w-full h-full outline-none bg-transparent"
              />
              <label
                className="absolute left-[10px] top-[12px] text-gray-500 text-[14px] transition-all duration-200 
              peer-focus:top-[-10px] peer-focus:text-[12px]
              peer-valid:top-[-10px] peer-valid:text-[12px]
              bg-white px-[4px]"
              >
                Enter OTP
              </label>
            </div>
            <div className="relative w-full h-[50px] border-2 border-gray-300 rounded-xl px-[10px]">
              <input
                type="text"
                value={formData.email}
                onChange={onChange}
                name="email"
                placeholder=" "
                required
                className="peer w-full h-full outline-none bg-transparent"
              />
              <label
                className="absolute left-[10px] top-[12px] text-gray-500 text-[14px] transition-all duration-200 
              peer-focus:top-[-10px] peer-focus:text-[12px]
              peer-valid:top-[-10px] peer-valid:text-[12px]
              bg-white px-[4px]"
              >
                Email
              </label>
            </div>

            <button className="w-full h-[45px] bg-black text-white rounded-xl mt-[10px]">
              {loading ? <ClipLoader size={30} color="white" /> : "Verify OTP"}
            </button>
          </form>
        </div>

        <div className="hidden lg:flex w-[50%] bg-black rounded-l-[30px] flex-col justify-center items-center gap-[10px]">
          <img src={logo2} alt="" className="w-[200px]" />
          <p className="text-white text-center font-bold">
            Enter OTP sent to your email
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
