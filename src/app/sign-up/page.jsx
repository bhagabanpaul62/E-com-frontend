"use client";
import { AiOutlineLoading } from "react-icons/ai";
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const email = emailRef.current.value?.trim();
    if (!email) {
      setErrorMsg("Please enter your email or phone.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/users/send-otp`,
        { email }
      );

      router.push(`/sign-up/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <form
        onSubmit={submitHandler}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm space-y-6 border"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h2>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
            {errorMsg}
          </div>
        )}

        {/* Email Field */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email or Phone
          </label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email or phone"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            ref={emailRef}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold py-2 rounded-md text-white transition duration-200 flex justify-center items-center
            ${
              loading
                ? "bg-amber-500 cursor-not-allowed"
                : "bg-amber-400 hover:bg-amber-500"
            }`}
        >
          {loading ? (
            <AiOutlineLoading className="animate-spin text-2xl" />
          ) : (
            <span>Send OTP</span>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-sm text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Google Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          <span className="text-sm text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>

        {/* Already have account */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-amber-500 hover:underline">
            Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
