"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/users/login`,
        {
          email: emailOrPhone,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login response:", res.data);

      // Save access token and user data in localStorage as a fallback
      if (res?.data?.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.data.accessToken);
      }
      
      // Save user data in localStorage
      if (res?.data?.data?.user) {
        const userData = res.data.data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Set a specific admin flag for easier checking
        if (userData.isAdmin) {
          localStorage.setItem("isAdmin", "true");
          console.log("Admin login successful, storing admin flag");
        }
      }

      const isAdmin = res?.data?.data?.user?.isAdmin;

      if (isAdmin) {
        // For admin users, add a delay to ensure cookies are properly set
        setLoading(true);
        setErrorMsg("");
        setTimeout(() => {
          // Force a hard refresh to ensure cookies are properly set
          window.location.href = "/admin";
        }, 1000);
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Login failed. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Welcome Back
        </h2>

        {errorMsg && (
          <div className="text-red-600 text-sm text-center">{errorMsg}</div>
        )}

        <fieldset disabled={loading} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="emailOrPhone"
              className="text-sm font-medium text-gray-700"
            >
              Email or Phone
            </label>
            <input
              type="text"
              id="emailOrPhone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="Enter Email or Phone"
              required
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-amber-400 text-white font-semibold py-2 rounded-md transition duration-200 ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-amber-500"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </fieldset>

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-sm text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

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

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/sign-up" className="text-amber-500 hover:underline">
            Sign Up
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
