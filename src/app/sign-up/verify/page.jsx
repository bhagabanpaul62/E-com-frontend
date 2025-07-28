"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function OtpVerify() {
  const otpRef = useRef("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailId = searchParams.get("email");
  console.log(emailId);

  const [loading, setLoading] = useState(false);

  const submitOtp = async (e) => {
    e.preventDefault();
    const email = emailId;
    const otp = otpRef.current.value;
    if (!otp) return alert("please enter the otp");
    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/users/verify-otp`,
        { email , code:otp }
      );

      console.log("data", res);
      router.push(`/sign-up/register?email=${encodeURIComponent(emailId)}`);
      setLoading(false);
    } catch (error) {
      console.log( " if i am fail data :" , otp,email);
      
      
      alert(error || +"something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 sm:p-10">
        <div className="mb-6 text-center">
          {/* Optional: Add your logo here */}
          <h1 className="text-3xl font-bold text-gray-800">OTP Verification</h1>
          <p className="text-sm text-gray-600 mt-2">
            Enter the 6-digit code sent to <strong>{emailId}</strong>
          </p>
        </div>

        <form onSubmit={submitOtp} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            required
            ref={otpRef}
            placeholder="Enter OTP"
            className="w-full px-5 py-3 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-md transition duration-200 flex justify-center items-center 
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-600">
          Didn’t receive the code?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            Resend OTP
          </span>
        </div>
      </div>
    </div>
  );
}
