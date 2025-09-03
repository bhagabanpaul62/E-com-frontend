"use client";

import React, { useState } from "react";
import {
  FaDownload,
  FaApple,
  FaGooglePlay,
  FaMobile,
  FaQrcode,
  FaBell,
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaTruck,
  FaGift,
  FaShieldAlt,
  FaBolt,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
  FaEnvelope,
  FaSms,
  FaWhatsapp,
  FaHome,
  FaUser,
} from "react-icons/fa";
import Image from "next/image";

export default function DownloadApp() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notifyMethod, setNotifyMethod] = useState("email");

  const features = [
    {
      icon: <FaBolt className="text-3xl text-amber-600" />,
      title: "Lightning Fast",
      description:
        "Optimized for speed with instant loading and smooth navigation",
    },
    {
      icon: <FaBell className="text-3xl text-blue-600" />,
      title: "Push Notifications",
      description:
        "Get instant alerts for deals, order updates, and exclusive offers",
    },
    {
      icon: <FaShoppingCart className="text-3xl text-emerald-600" />,
      title: "One-Tap Shopping",
      description: "Quick checkout with saved payment methods and addresses",
    },
    {
      icon: <FaHeart className="text-3xl text-rose-600" />,
      title: "Personalized Experience",
      description:
        "Curated recommendations based on your preferences and history",
    },
    {
      icon: <FaGift className="text-3xl text-indigo-600" />,
      title: "App-Only Deals",
      description:
        "Exclusive discounts and offers available only on mobile app",
    },
    {
      icon: <FaShieldAlt className="text-3xl text-slate-600" />,
      title: "Secure Payments",
      description:
        "Enhanced security with biometric authentication and encryption",
    },
  ];

  const appBenefits = [
    "📱 Native mobile experience",
    "🔔 Real-time notifications",
    "💾 Offline browsing capability",
    "🎯 Personalized recommendations",
    "⚡ Faster than website",
    "🔒 Enhanced security",
    "📍 Location-based offers",
    "🎁 App-exclusive deals",
  ];

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    console.log("Notify request:", { email, phone, method: notifyMethod });
    // Here you would typically send the data to your backend
    alert("Thank you! We'll notify you when the app is ready.");
    setEmail("");
    setPhone("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-6 shadow-xl">
                  <FaMobile className="text-3xl text-white" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-white">
                    Tajbee Mobile App
                  </h1>
                  <p className="text-xl text-blue-200">Coming Soon</p>
                </div>
              </div>

              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Experience the future of shopping with our upcoming mobile app.
                Get ready for faster browsing, exclusive deals, and seamless
                checkout right at your fingertips.
              </p>

              {/* Coming Soon Badge */}
              <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 rounded-full px-6 py-3 mb-8 shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white font-semibold text-lg">
                  Launching Soon
                </span>
              </div>

              {/* Download Buttons (Disabled) */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  disabled
                  className="flex items-center justify-center bg-slate-800/50 text-white border-2 border-slate-600/50 px-8 py-4 rounded-xl font-semibold text-lg opacity-60 cursor-not-allowed backdrop-blur-sm"
                >
                  <FaApple className="text-2xl mr-3" />
                  <div className="text-left">
                    <div className="text-sm">Download on the</div>
                    <div className="text-lg font-bold">App Store</div>
                  </div>
                </button>
                <button
                  disabled
                  className="flex items-center justify-center bg-slate-800/50 text-white border-2 border-slate-600/50 px-8 py-4 rounded-xl font-semibold text-lg opacity-60 cursor-not-allowed backdrop-blur-sm"
                >
                  <FaGooglePlay className="text-2xl mr-3" />
                  <div className="text-left">
                    <div className="text-sm">Get it on</div>
                    <div className="text-lg font-bold">Google Play</div>
                  </div>
                </button>
              </div>

              <p className="text-blue-300 text-sm">
                * Download buttons will be active once the app is launched
              </p>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone Frame */}
                <div className="w-80 h-[600px] bg-gradient-to-b from-gray-900 to-black rounded-[3rem] p-4 shadow-2xl border-8 border-gray-800">
                  <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="bg-white px-6 py-4 flex justify-between items-center">
                      <div className="text-sm font-semibold text-gray-900">
                        9:41
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-4 h-2 bg-gray-300 rounded-sm"></div>
                        <div className="w-4 h-2 bg-gray-300 rounded-sm"></div>
                        <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4">
                      <h3 className="text-white text-xl font-bold">Tajbee</h3>
                      <p className="text-white/90 text-sm">Shop with ease</p>
                    </div>

                    {/* App Content Preview */}
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="w-full h-20 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded mb-1"></div>
                          <div className="h-4 bg-amber-200 rounded w-2/3"></div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="w-full h-20 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded mb-1"></div>
                          <div className="h-4 bg-amber-200 rounded w-3/4"></div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-red-200 rounded-full"></div>
                          <div className="h-3 bg-gray-200 rounded flex-1"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white p-4 flex justify-around border-t border-gray-200">
                      <FaHome className="text-amber-500 text-xl" />
                      <FaShoppingCart className="text-gray-400 text-xl" />
                      <FaHeart className="text-gray-400 text-xl" />
                      <FaUser className="text-gray-400 text-xl" />
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <FaBell className="text-white text-xl" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <FaGift className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why You'll Love Our App
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed with you in mind, our app delivers an exceptional
              shopping experience with powerful features and intuitive design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 group hover:scale-105"
              >
                <div className="flex items-center mb-6">
                  {feature.icon}
                  <h3 className="text-2xl font-bold text-gray-900 ml-4">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Everything You Need in One App
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our mobile app brings together all the features you love about
                shopping online, optimized for mobile and enhanced with
                exclusive app-only benefits.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {appBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <FaQrcode className="text-6xl text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  QR Code Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  Scan this QR code with your phone to quickly download the app
                  once it's available.
                </p>
                <div className="bg-gray-100 rounded-xl p-6 text-gray-500">
                  QR code will appear here when the app launches
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notify Me Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl border border-slate-700">
            <h2 className="text-4xl font-bold mb-4">Be the First to Know</h2>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              Get notified as soon as our mobile app is available for download.
              Plus, early subscribers get exclusive launch offers!
            </p>

            {/* Notification Method Selector */}
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setNotifyMethod("email")}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
                  notifyMethod === "email"
                    ? "bg-white text-slate-800"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <FaEnvelope className="mr-2" />
                Email
              </button>
              <button
                onClick={() => setNotifyMethod("sms")}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
                  notifyMethod === "sms"
                    ? "bg-white text-slate-800"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <FaSms className="mr-2" />
                SMS
              </button>
              <button
                onClick={() => setNotifyMethod("whatsapp")}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
                  notifyMethod === "whatsapp"
                    ? "bg-white text-purple-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <FaWhatsapp className="mr-2" />
                WhatsApp
              </button>
            </div>

            <form onSubmit={handleNotifySubmit} className="max-w-md mx-auto">
              {notifyMethod === "email" ? (
                <div className="mb-6">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-6 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-200"
                  />
                </div>
              ) : (
                <div className="mb-6">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                    className="w-full px-6 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-200"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-white text-slate-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors flex items-center justify-center"
              >
                <FaBell className="mr-3" />
                Notify Me When Ready
                <FaArrowRight className="ml-3" />
              </button>
            </form>

            <p className="text-blue-200 text-sm mt-6">
              🎁 Early subscribers get 20% off their first app order!
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-slate-600 mb-2">50K+</div>
              <div className="text-gray-600">People Waiting</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">App Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                99.9%
              </div>
              <div className="text-gray-600">Uptime Guaranteed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                iOS & Android
              </div>
              <div className="text-gray-600">Both Platforms</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                When will the app be available?
              </h3>
              <p className="text-gray-600">
                We're working hard to launch the app soon! Subscribe to
                notifications to be the first to know when it's ready.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Will it be free to download?
              </h3>
              <p className="text-gray-600">
                Yes! The Tajbee mobile app will be completely free to download
                and use on both iOS and Android devices.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What devices will be supported?
              </h3>
              <p className="text-gray-600">
                The app will support iOS 13+ and Android 8.0+, covering most
                modern smartphones and tablets.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Will there be app-exclusive features?
              </h3>
              <p className="text-gray-600">
                Absolutely! App users will enjoy exclusive deals, push
                notifications, offline browsing, and faster checkout options.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
