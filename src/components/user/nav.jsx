"use client";
import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import {
  FaUser,
  FaBoxOpen,
  FaHeart,
  FaTicketAlt,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Nav({ user }) {
  const [enterMouse, setEnterMouse] = useState(false);
  const [Login, setLogin] = useState(false);
  useEffect(() => {
    if (!user || !user.name) {
      setLogin(true);
    }
  }, [user]);

  const handelMouseEnter = (e) => {
    console.log("maouse enter", e);
    setEnterMouse(true);
  };

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
      setLogin(false);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-white border-b shadow-sm flex items-center justify-between px-8 md:px-16 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image
          src="/Tajbee3.png"
          alt="Tajbee Logo"
          width={130}
          height={40}
          style={{ width: "130px", height: "auto" }} // or set both in props
          priority
        />
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center bg-gray-100 rounded-lg w-[40vw] max-w-lg h-10 px-4">
        <IoIosSearch className="text-gray-500 text-xl mr-2" />
        <input
          type="text"
          className="w-full h-full bg-transparent px-2 text-black text-base outline-none placeholder:text-gray-400"
          placeholder="Search for Products, Brands and More"
        />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-8 text-base font-medium">
        {/* Login */}
        <div
          onMouseEnter={handelMouseEnter}
          onMouseLeave={() => setEnterMouse(false)}
          className="relative flex items-center gap-2 rounded-lg transition-colors duration-200 cursor-pointer px-4 py-2 hover:bg-amber-400 hover:text-white group"
        >
          <FaRegUserCircle className="text-2xl" />
          {Login ? (
            <span className="hidden sm:inline">Login</span>
          ) : (
            <span className="hidden sm:inline">
              {user?.fullName || user?.name || "Account"}
            </span>
          )}
          <FaChevronDown className="text-base text-gray-500 transition-transform duration-200 group-hover:rotate-180" />
          {enterMouse && (
            <div className="absolute top-10 left-[-10] min-w-[170px] bg-white border border-gray-200 shadow-lg rounded-lg py-2 flex flex-col gap-1">
              {Login ? (
                <>
                  <Link
                    href="/login"
                    className="block px-5 py-2 text-gray-700 hover:bg-amber-400 hover:text-white rounded transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/sign-up"
                    className="block px-5 py-2 text-gray-700 hover:bg-amber-400 hover:text-white rounded transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <button
                    className="flex items-center  gap-2 w-full px-5 py-2 text-amber-700 bg-amber-100 hover:bg-amber-400 hover:text-white rounded transition-colors font-semibold"
                    onClick={LogOut}
                  >
                    <FaSignOutAlt className="text-lg" /> Log Out
                  </button>
                  <Link
                    href="#"
                    className="flex items-center  gap-2 px-5 py-2 text-gray-700 hover:bg-amber-100 hover:text-amber-700 rounded transition-colors"
                  >
                    <FaUser className="text-lg" /> My Profile
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center  gap-2 px-5 py-2 text-gray-700 hover:bg-amber-100 hover:text-amber-700 rounded transition-colors"
                  >
                    <FaBoxOpen className="text-lg" /> Order
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center  gap-2 px-5 py-2 text-gray-700 hover:bg-amber-100 hover:text-amber-700 rounded transition-colors"
                  >
                    <FaHeart className="text-lg" /> Wishlist
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-2 px-5 py-2 text-gray-700 hover:bg-amber-100 hover:text-amber-700 rounded transition-colors"
                  >
                    <FaTicketAlt className="text-lg" /> Coupon
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors">
          <FaShoppingCart className="text-2xl" />
          <span className="hidden sm:inline">Cart</span>
        </div>
      </div>
    </div>
  );
}
