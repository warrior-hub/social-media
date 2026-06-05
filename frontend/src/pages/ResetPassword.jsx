import React, { useState } from "react";
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SERVER_URL from "../config";

const ResetPassword = () => {
  const [newPassword, setPassword] = useState("");
  const [ConfirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const resetToken = localStorage.getItem("resetToken");
  async function handleSubmit(e) {
    e.preventDefault();
    setloading(true);
    if (newPassword !== ConfirmNewPassword) {
      setloading(false)
      return toast.error("Password does not match");      
    }
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/auth/reset-password`,
        { resetToken, newPassword, ConfirmNewPassword },
      );

      console.log(res.data);
      setloading(false);
      navigate("/signin");
    } catch (error) {
      console.log(error.response?.data);
      setloading(false);
    }
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex justify-center items-center">
      <div className="w-[90%] lg:max-w-[60%] h-[500px] bg-white rounded-2xl flex overflow-hidden border-2 border-[#1a1f23]">
       
        <div className="w-full lg:w-[50%] flex flex-col items-center justify-center px-[25px] gap-[20px]">
          <div className="flex gap-[10px] items-center text-[22px] font-semibold mb-4">
            <span>New Password</span>
            <img src={logo} alt="" className="w-[70px]" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-[15px]"
          >
            <div className="relative w-full h-[50px] border-2 border-gray-300 rounded-xl px-[10px]">
              <input
                type="password"
                value={newPassword}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
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
                Enter New Password
              </label>
            </div>
            <div className="relative w-full h-[50px] border-2 border-gray-300 rounded-xl px-[10px]">
              <input
                type="ConfirmNewPassword"
                value={ConfirmNewPassword}
                name="password"
                onChange={(e) => setConfirmNewPassword(e.target.value)}
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
                Confirm New Password
              </label>
            </div>

            <button
              className="w-full h-[45px] bg-black text-white rounded-xl mt-[10px] cursor-pointer"
              onClick={handleSubmit}
            >
              {loading ? (
                <ClipLoader size={30} color="white" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>

       
        <div className="hidden lg:flex w-[50%] bg-black rounded-l-[30px] flex-col justify-center items-center gap-[10px]">
          <img src={logo2} alt="" className="w-[200px]" />
          <p className="text-white text-center font-bold">
            Create a strong new password
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
