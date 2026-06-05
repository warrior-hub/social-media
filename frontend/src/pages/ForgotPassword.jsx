import React, { useState } from "react";
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SERVER_URL from "../config";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate =useNavigate();
  //  Send OTP
  async function handleSendOTP(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${SERVER_URL}/api/auth/send-otp`,
        { email }
      );

      console.log(res.data);
      toast.success(res.data.message)
      setOtpSent(true); 
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data.message)
    } finally {
      setLoading(false);
    }
  }

  // Verify OTP
  async function handleVerifyOTP(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${SERVER_URL}/api/auth/verify-otp`,
        { email, otp }
      );

      console.log(res.data);
      toast.success(res.data.message)
      localStorage.setItem("resetToken",res.data.token)
      navigate("/reset-password")
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data.message)
  
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex justify-center items-center">
      <div className="w-[90%] lg:max-w-[60%] h-[500px] bg-white rounded-2xl flex overflow-hidden border-2 border-[#1a1f23]">
        
       
        <div className="w-full lg:w-[50%] flex flex-col items-center justify-center px-[25px] gap-[20px]">
          
          <div className="flex gap-[10px] items-center text-[22px] font-semibold mb-4">
            <span>Reset Password</span>
            <img src={logo} alt="" className="w-[70px]" />
          </div>

          <form className="w-full flex flex-col gap-[15px]">

          
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full h-[45px] border-2 border-gray-300 rounded-xl px-3 outline-none"
            />

          
            {!otpSent && (
              <button
                onClick={handleSendOTP}
                className="w-full cursor-pointer h-[45px] bg-black text-white rounded-xl"
              >
                {loading ? <ClipLoader size={25} color="white" /> : "Send OTP"}
              </button>
            )}

           
            {otpSent && (
              <>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full h-[45px] border-2 border-gray-300 rounded-xl px-3 outline-none"
                />

                <button
                  onClick={handleVerifyOTP}
                  className="w-full h-[45px] bg-black text-white rounded-xl cursor-pointer"
                >
                  {loading ? (
                    <ClipLoader size={25} color="white" />
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </>
            )}
          </form>

          <p className="text-gray-500 text-[14px] text-center">
            Remember your password?{" "}
            <a href="/signin" className="text-black font-semibold underline cursor-pointer">
              Sign In
            </a>
          </p>
        </div>

      
        <div className="hidden lg:flex w-[50%] bg-black flex-col justify-center items-center gap-[10px]">
          <img src={logo2} alt="" className="w-[200px]" />
          <p className="text-white text-center font-bold">
            Secure your account in seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;