// Moved from user/nav.jsx
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
  FaBars,
  FaTimes,
  FaHome,
  FaTags,
  FaPercent,
  FaStore,
  FaHeadset,
  FaChevronRight,
  FaMapMarkerAlt,
  FaTruck,
  FaCog,
  FaMoon,
  FaSun,
  FaLanguage,
} from "react-icons/fa";

export default function Nav({ user }) {
  const [enterMouse, setEnterMouse] = useState(false);
  const [cartHover, setCartHover] = useState(false);
  const [Login, setLogin] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    if (user && user.name) {
      setLogin(false);
      return;
    }

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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Logout successful:", res.data);
      setLogin(true);
      setLocalUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
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

        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-in {
          animation: slideInFromTop 0.2s ease-out;
        }

        .slide-in-from-top-2 {
          animation-duration: 0.2s;
        }

        .slide-in-from-left {
          animation: slideInFromLeft 0.3s ease-out;
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .mobile-backdrop {
          backdrop-filter: blur(2px);
        }

        .mobile-menu-scroll::-webkit-scrollbar {
          display: none;
        }
        .mobile-menu-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="fixed top-0 left-0 w-full h-14 sm:h-16 bg-white border-b shadow-sm flex items-center justify-between px-3 sm:px-4 md:px-8 lg:px-16 z-50">
        <div className="sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <FaTimes className="text-xl text-gray-700" />
            ) : (
              <FaBars className="text-xl text-gray-700" />
            )}
          </button>
        </div>

        <Link href="/" className="flex items-center">
          <Image
            src="/Tajbee3.png"
            alt="Tajbee Logo"
            width={110}
            height={35}
            className="w-20 sm:w-24 md:w-28 lg:w-32 h-auto"
            priority
          />
        </Link>

        <div className="hidden sm:flex items-center bg-gray-100 rounded-lg flex-1 max-w-md lg:max-w-lg xl:max-w-xl h-8 sm:h-9 md:h-10 px-3 mx-4">
          <IoIosSearch className="text-gray-500 text-lg sm:text-xl mr-2" />
          <input
            type="text"
            className="w-full h-full bg-transparent px-1 sm:px-2 text-black text-sm sm:text-base outline-none placeholder:text-gray-400"
            placeholder="Search for Products, Brands and More"
          />
        </div>

        <div className="sm:hidden flex items-center gap-3">
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-2"
          >
            <IoIosSearch className="text-gray-600 text-xl" />
          </button>
          <div className="relative">
            <FaShoppingCart className="text-xl text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 sm:gap-4 lg:gap-8 text-sm sm:text-base font-medium">
          <div
            onMouseEnter={handelMouseEnter}
            onMouseLeave={() => setEnterMouse(false)}
            className="relative flex items-center gap-1 sm:gap-2 rounded-lg transition-colors duration-200 cursor-pointer px-2 sm:px-4 py-1 sm:py-2 hover:bg-orange-500 hover:text-white group"
          >
            <FaRegUserCircle className="text-xl sm:text-2xl" />
            {Login ? (
              <span className="hidden md:inline">Login</span>
            ) : (
              <span className="hidden md:inline">
                {user?.fullName ||
                  user?.name ||
                  localUser?.fullName ||
                  localUser?.name ||
                  "Account"}
              </span>
            )}
            <FaChevronDown className="hidden sm:inline text-xs sm:text-base text-gray-500 transition-transform duration-200 group-hover:rotate-180" />
            {enterMouse && (
              <div className="absolute top-10 right-0 w-80 bg-white border border-gray-200 shadow-2xl rounded-lg overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                {Login ? (
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
                  <div>
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

                    <div className="p-2">
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

          <div
            onMouseEnter={() => setCartHover(true)}
            onMouseLeave={() => setCartHover(false)}
            className="relative flex items-center gap-1 sm:gap-2 rounded-lg transition-colors duration-200 cursor-pointer px-2 sm:px-4 py-1 sm:py-2 hover:bg-orange-500 hover:text-white group"
          >
            <FaShoppingCart className="text-xl sm:text-2xl" />
            <span className="hidden md:inline">Cart</span>
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center group-hover:bg-white group-hover:text-orange-500">
              3
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 mobile-backdrop">
          <div className="bg-white p-4 slide-in-from-top">
            <div className="flex items-center space-x-3">
              <IoIosSearch className="text-gray-500 text-xl" />
              <input
                type="text"
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-black outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Search for Products, Brands and More"
                autoFocus
              />
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="p-2 text-gray-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 mobile-backdrop">
          <div className="bg-white w-80 h-full slide-in-from-left">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                    <FaUser />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {Login
                        ? "Guest User"
                        : user?.fullName ||
                          user?.name ||
                          localUser?.fullName ||
                          localUser?.name ||
                          "User"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {Login ? "Please login" : "Welcome back!"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            <div className="mobile-menu-scroll overflow-y-auto h-full pb-20">
              {/* Main Navigation */}
              <div className="p-4 space-y-2">
                <Link
                  href="/"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaHome className="text-orange-500" />
                  <span>Home</span>
                </Link>
                <Link
                  href="/categories"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaTags className="text-orange-500" />
                  <span>Categories</span>
                </Link>
                <Link
                  href="/deals"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaPercent className="text-orange-500" />
                  <span>Deals</span>
                </Link>
                <Link
                  href="/brands"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaStore className="text-orange-500" />
                  <span>Brands</span>
                </Link>
              </div>

              {/* Account Section */}
              {!Login && (
                <div className="border-t p-4 space-y-2">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    My Account
                  </h3>
                  <Link
                    href="/account"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaUser className="text-blue-500" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/account/orders"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaBoxOpen className="text-green-500" />
                    <span>Orders</span>
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaHeart className="text-red-500" />
                    <span>Wishlist</span>
                  </Link>
                </div>
              )}

              {/* Support */}
              <div className="border-t p-4 space-y-2">
                <h3 className="font-semibold text-gray-800 mb-2">Support</h3>
                <Link
                  href="/help"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaHeadset className="text-purple-500" />
                  <span>Help Center</span>
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaQuestionCircle className="text-gray-500" />
                  <span>Contact Us</span>
                </Link>
              </div>

              {/* Login/Logout */}
              <div className="border-t p-4">
                {Login ? (
                  <Link
                    href="/login"
                    className="flex items-center justify-center space-x-3 w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Login</span>
                  </Link>
                ) : (
                  <button
                    onClick={LogOut}
                    className="flex items-center justify-center space-x-3 w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
