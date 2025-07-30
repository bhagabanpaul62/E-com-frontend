"use client";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const LogOut = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/users/logout`,
        {}, // empty body
        {
          withCredentials: true, // 🔑 this sends cookies
        }
      );
      console.log("Logout successful:", res.data);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen gap-10">
      <Link
        href="/login"
        className="bg-amber-300 px-5 py-2 w-20 h-12 flex justify-center items-center rounded"
      >
        Login
      </Link>

      <button
        className="bg-red-300 px-5 py-2 w-20 h-12 flex justify-center items-center rounded"
        onClick={LogOut}
      >
        logOut
      </button>
    </div>
  );
}
