"use client"
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function OtpVerify() {
  const otpRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailId = searchParams.get("email");

  const [loading, setLoading] = useState(false);
  const [wrongOtp, setWrongOtp] = useState(false);

  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const reSendOtp = async () => {
    try {
      setResendDisabled(true);
      setResendTimer(30); // 30 seconds wait time

      await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/users/send-otp`, {
        email: emailId,
      });

      
    } catch (error) {
      alert("Failed to resend OTP. Try again later.");
      setResendDisabled(false);
      setResendTimer(0);
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    const email = emailId;
    const otp = otpRef.current.value;

    if (!otp) return alert("Please enter the OTP");

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/users/verify-otp`,
        { email, code: otp }
      );

      console.log("OTP Verified:", res.data);
      router.push(`/sign-up/register?email=${encodeURIComponent(emailId)}`);
    } catch (error) {
      console.log("OTP verification failed:", otp, email);
      setWrongOtp(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 sm:p-10">
        <div className="mb-6 text-center">
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
            className={`w-full px-5 py-3 border rounded-md text-center text-lg tracking-widest ${
              wrongOtp
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-yellow-500"
            } focus:outline-none focus:ring-2`}
          />

          {wrongOtp && (
            <p className="text-sm text-red-500 text-center -mt-2">
              Invalid OTP. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-md transition duration-200 flex justify-center items-center ${
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
          <span
            className={`${
              resendDisabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:underline cursor-pointer"
            }`}
            onClick={!resendDisabled ? reSendOtp : undefined}
          >
            {resendDisabled ? `Resend in ${resendTimer}s` : "Resend OTP"}
          </span>
        </div>
      </div>
    </div>
  );
}
