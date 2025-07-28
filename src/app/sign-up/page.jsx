"use client";
import { AiOutlineLoading } from "react-icons/ai";
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


const SignUp = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    const email = emailRef.current.value;
    if (!email) return alert("Please enter your email or phone.");

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/users/send-otp`,
        {
          email,
        }
      );
      
      
      router.push(`/sign-up/verify?email=${encodeURIComponent(email)}`);
      setLoading(false);
      // Optionally redirect or go to next step
    } catch (err) {
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={submitHandler}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Create Your Account
        </h2>

        {/* Email Field */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email or Phone
          </label>
          <input
            type="email"
            id="email"
            name="email"
           
            placeholder="Enter your email or Phone"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
            ref={emailRef}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full text-white font-semibold py-2 rounded-md transition duration-200 flex justify-center 
          ${
            loading
              ? "bg-amber-500 cursor-not-allowed"
              : "bg-amber-400 hover:bg-amber-500"
          }
        `}
        >
          {loading ? (
            <AiOutlineLoading className=" animate-spin text-2xl text-white font-bold te " />
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
