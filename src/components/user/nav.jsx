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
  FaCreditCard,
  FaGift,
  FaBell,
  FaQuestionCircle,
  FaDownload,
} from "react-icons/fa";

export default function Nav({ user }) {
  const [enterMouse, setEnterMouse] = useState(false);
  const [cartHover, setCartHover] = useState(false);
  const [Login, setLogin] = useState(false);
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    // First check if we have a server-provided user
    if (user && user.name) {
      setLogin(false);
      return;
    }

    // If no server user, check localStorage
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setLocalUser(parsedUser);
        setLogin(false);
      } else {
        setLogin(true);
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      setLogin(true);
    }
  }, [user]);

  const handelMouseEnter = (e) => {
    console.log("maouse enter", e);
    setEnterMouse(true);
  };

  const LogOut = async () => {
    try {
      // Clear localStorage first
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/users/logout`,
        {}, // empty body
        {
          withCredentials: true, // 🔑 this sends cookies
        }
      );
      console.log("Logout successful:", res.data);
      setLogin(true);
      setLocalUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API call fails, ensure local state is cleared
      setLogin(true);
      setLocalUser(null);
      window.location.reload();
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: slideInFromTop 0.2s ease-out;
        }

        .slide-in-from-top-2 {
          animation-duration: 0.2s;
        }
      `}</style>
      <div className="fixed top-0 left-0 w-full h-16 bg-white border-b shadow-sm flex items-center justify-between px-8 md:px-16 z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/Tajbee3.png"
            alt="Tajbee Logo"
            width={130}
            height={40}
            style={{ width: "130px", height: "auto" }} // or set both in props
            priority
          />
        </Link>

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
                {user?.fullName ||
                  user?.name ||
                  localUser?.fullName ||
                  localUser?.name ||
                  "Account"}
              </span>
            )}
            <FaChevronDown className="text-base text-gray-500 transition-transform duration-200 group-hover:rotate-180" />
            {enterMouse && (
              <div className="absolute top-10 right-0 w-80 bg-white border border-gray-200 shadow-2xl rounded-lg overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                {Login ? (
                  // Login Section
                  <div className="p-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Welcome to Tajbee
                      </h3>
                      <p className="text-sm text-gray-600">
                        Login to get access to your Orders, Wishlist and
                        Recommendations
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/login"
                        className="block w-full text-center px-4 py-3 bg-amber-400 text-white font-semibold rounded-lg hover:bg-amber-500 transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/sign-up"
                        className="block w-full text-center px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Sign Up
                      </Link>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <Link
                          href="#"
                          className="flex items-center gap-2 p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                        >
                          <FaQuestionCircle />
                          Help Center
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center gap-2 p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                        >
                          <FaDownload />
                          Download App
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  // User Account Section
                  <div>
                    {/* User Header */}
                    <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <FaRegUserCircle className="text-xl" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">
                            {user?.fullName ||
                              user?.name ||
                              localUser?.fullName ||
                              localUser?.name ||
                              "User"}
                          </p>
                          <p className="text-sm opacity-90">
                            {user?.email ||
                              localUser?.email ||
                              "user@tajbee.com"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      {/* Primary Actions */}
                      <div className="space-y-1 mb-3">
                        <Link
                          href="/account"
                          className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group"
                        >
                          <FaUser className="text-lg group-hover:scale-110 transition-transform" />
                          <span className="font-medium">My Profile</span>
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors group"
                        >
                          <FaBoxOpen className="text-lg group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Orders</span>
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors group"
                        >
                          <FaHeart className="text-lg group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Wishlist</span>
                        </Link>
                      </div>

                      {/* Secondary Actions */}
                      <div className="border-t border-gray-200 pt-3 space-y-1 mb-3">
                        <Link
                          href="/rewards"
                          className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors group"
                        >
                          <FaGift className="text-lg group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Rewards</span>
                        </Link>
                        <Link
                          href="/coupons"
                          className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-colors group"
                        >
                          <FaTicketAlt className="text-lg group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Gift Cards</span>
                        </Link>
                        <Link
                          href="/payments"
                          className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors group"
                        >
                          <FaCreditCard className="text-lg group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Saved Cards</span>
                        </Link>
                        <Link
                          href="/notifications"
                          className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors group"
                        >
                          <FaBell className="text-lg group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Notifications</span>
                        </Link>
                      </div>

                      {/* Help & Support */}
                      <div className="border-t border-gray-200 pt-3 space-y-1 mb-3">
                        <Link
                          href="/help"
                          className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <FaQuestionCircle className="text-lg" />
                          <span className="font-medium">Help Center</span>
                        </Link>
                        <Link
                          href="/download"
                          className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <FaDownload className="text-lg" />
                          <span className="font-medium">Download App</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-200 pt-3">
                        <button
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                          onClick={LogOut}
                        >
                          <FaSignOutAlt className="text-lg group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <div
            className="relative flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors group"
            onMouseEnter={() => setCartHover(true)}
            onMouseLeave={() => setCartHover(false)}
          >
            <div className="relative">
              <FaShoppingCart className="text-2xl" />
              {/* Cart Badge */}
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </div>
            <span className="hidden sm:inline">Cart</span>

            {/* Cart Dropdown */}
            {cartHover && (
              <div className="absolute top-10 right-0 w-80 bg-white border border-gray-200 shadow-2xl rounded-lg overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      My Cart
                    </h3>
                    <span className="text-sm text-gray-500">3 items</span>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {/* Sample Cart Item */}
                    <div className="flex items-center gap-3 p-2 border rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          Product Name
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: M, Color: Blue
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold text-amber-600">
                            ₹999
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ₹1299
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <button className="w-6 h-6 bg-gray-100 rounded text-xs font-bold">
                          +
                        </button>
                        <span className="text-sm">1</span>
                        <button className="w-6 h-6 bg-gray-100 rounded text-xs font-bold">
                          -
                        </button>
                      </div>
                    </div>

                    {/* More items can be added here */}
                  </div>

                  {/* Cart Summary */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-gray-800">
                        Total:
                      </span>
                      <span className="font-bold text-lg text-amber-600">
                        ₹2,997
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/cart"
                        className="block w-full text-center px-4 py-2 border border-amber-400 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        View Cart
                      </Link>
                      <Link
                        href="/checkout"
                        className="block w-full text-center px-4 py-2 bg-amber-400 text-white font-semibold rounded-lg hover:bg-amber-500 transition-colors"
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
