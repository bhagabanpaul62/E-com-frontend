"use client";

import React, { useState } from "react";
import {
  FaQuestionCircle,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaHeadset,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaTruck,
  FaCreditCard,
  FaUndo,
  FaShieldAlt,
  FaUser,
  FaGift,
  FaStar,
  FaChevronRight,
  FaDownload,
} from "react-icons/fa";
import Link from "next/link";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);

  const helpCategories = [
    {
      id: 1,
      title: "Order & Payment",
      icon: <FaShoppingCart className="text-2xl text-blue-600" />,
      description:
        "Questions about placing orders, payment methods, and billing",
      topics: [
        "How to place an order",
        "Payment options",
        "Payment failed",
        "Order confirmation",
      ],
    },
    {
      id: 2,
      title: "Shipping & Delivery",
      icon: <FaTruck className="text-2xl text-emerald-600" />,
      description: "Track orders, delivery times, and shipping information",
      topics: [
        "Track my order",
        "Delivery times",
        "Shipping charges",
        "Change delivery address",
      ],
    },
    {
      id: 3,
      title: "Returns & Refunds",
      icon: <FaUndo className="text-2xl text-amber-600" />,
      description: "Return policies, refund process, and exchange information",
      topics: [
        "Return policy",
        "How to return",
        "Refund status",
        "Exchange process",
      ],
    },
    {
      id: 4,
      title: "Account & Profile",
      icon: <FaUser className="text-2xl text-slate-600" />,
      description: "Manage your account, profile settings, and security",
      topics: [
        "Update profile",
        "Change password",
        "Account verification",
        "Delete account",
      ],
    },
    {
      id: 5,
      title: "Products & Reviews",
      icon: <FaStar className="text-2xl text-indigo-600" />,
      description: "Product information, reviews, and availability",
      topics: [
        "Product details",
        "Write reviews",
        "Product availability",
        "Product quality",
      ],
    },
    {
      id: 6,
      title: "Offers & Coupons",
      icon: <FaGift className="text-2xl text-rose-600" />,
      description: "Deals, discounts, coupon codes, and promotional offers",
      topics: ["Apply coupon", "Current offers", "Cashback", "Loyalty points"],
    },
  ];

  const faqData = [
    {
      id: 1,
      question: "How can I track my order?",
      answer:
        "You can track your order by logging into your account and visiting the 'My Orders' section. You'll find detailed tracking information including current status and expected delivery date. You can also use the tracking number sent to your email.",
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including Credit/Debit cards (Visa, MasterCard, RuPay), UPI payments, Net Banking, Wallets (Paytm, PhonePe, Google Pay), and Cash on Delivery (COD) for eligible orders.",
    },
    {
      id: 3,
      question: "How long does delivery take?",
      answer:
        "Standard delivery takes 3-7 business days depending on your location. Express delivery (1-2 days) is available in select cities. Same-day delivery is available for certain products in metro cities.",
    },
    {
      id: 4,
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for most products. Items must be in original condition with tags and packaging. Electronics have a 15-day return window. Certain items like intimate wear and consumables cannot be returned.",
    },
    {
      id: 5,
      question: "How do I apply a coupon code?",
      answer:
        "During checkout, you'll find a 'Coupon Code' field. Enter your code and click 'Apply'. The discount will be reflected in your order total. Make sure to check the coupon terms and conditions.",
    },
    {
      id: 6,
      question: "Is Cash on Delivery available?",
      answer:
        "Yes, COD is available for orders up to ₹10,000 in select areas. There may be additional COD charges depending on your location and order value. Check availability during checkout.",
    },
    {
      id: 7,
      question: "How do I cancel my order?",
      answer:
        "Orders can be cancelled within 24 hours of placement if they haven't been shipped. Go to 'My Orders', select the order, and click 'Cancel'. Refunds will be processed within 3-5 business days.",
    },
    {
      id: 8,
      question: "Do you offer warranty on products?",
      answer:
        "Yes, all products come with manufacturer warranty. Duration varies by product - electronics typically have 1-2 years, appliances have 1-5 years. Check individual product pages for specific warranty information.",
    },
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const filteredFAQs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaQuestionCircle className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Find answers to your questions and get the support you need
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Banner */}
      <div className="bg-slate-100 border-l-4 border-slate-500 p-4 mx-4 sm:mx-6 lg:mx-8 -mt-8 relative z-10 rounded-lg shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <FaHeadset className="text-slate-600 text-2xl mr-3" />
              <div>
                <p className="font-semibold text-slate-800">
                  Need immediate help?
                </p>
                <p className="text-slate-700">Our support team is here 24/7</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <a
                href="tel:+911234567890"
                className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
              >
                Call Now
              </a>
              <a
                href="#contact"
                className="bg-white text-slate-600 border-2 border-slate-500 px-6 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Live Chat
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Help Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse Help Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 group hover:scale-105"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {category.icon}
                    <h3 className="text-xl font-semibold text-gray-900 ml-3">
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="space-y-2">
                    {category.topics.slice(0, 3).map((topic, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <FaChevronRight className="w-3 h-3 mr-2" />
                        <span>{topic}</span>
                      </div>
                    ))}
                    {category.topics.length > 3 && (
                      <div className="text-sm text-blue-600 font-medium">
                        +{category.topics.length - 3} more topics
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {filteredFAQs.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredFAQs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        {openFAQ === faq.id ? (
                          <FaChevronUp className="text-blue-600 flex-shrink-0" />
                        ) : (
                          <FaChevronDown className="text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                    {openFAQ === faq.id && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FaSearch className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No FAQs found matching your search.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 sm:p-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Still Need Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Live Chat */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeadset className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Live Chat
              </h3>
              <p className="text-gray-600 mb-4">
                Chat with our support team in real-time
              </p>
              <div className="flex items-center justify-center text-emerald-600 mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">Available 24/7</span>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full">
                Start Chat
              </button>
            </div>

            {/* Email Support */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-2xl text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Email Support
              </h3>
              <p className="text-gray-600 mb-4">
                Send us an email and we'll respond within 24 hours
              </p>
              <div className="flex items-center justify-center text-gray-500 mb-4">
                <FaClock className="mr-2" />
                <span className="text-sm">Response within 24h</span>
              </div>
              <a
                href="mailto:support@tajbee.com"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium w-full inline-block"
              >
                Send Email
              </a>
            </div>

            {/* Phone Support */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPhone className="text-2xl text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Phone Support
              </h3>
              <p className="text-gray-600 mb-4">
                Call us directly for immediate assistance
              </p>
              <div className="text-gray-500 text-sm mb-4">
                <div className="flex items-center justify-center mb-1">
                  <FaClock className="mr-2" />
                  <span>Mon-Sun: 9 AM - 9 PM</span>
                </div>
                <div className="font-medium text-gray-900">
                  +91 1234 567 890
                </div>
              </div>
              <a
                href="tel:+911234567890"
                className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium w-full inline-block"
              >
                Call Now
              </a>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Additional Resources
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/terms"
              className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Privacy Policy
            </Link>
            <Link
              href="/shipping"
              className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Shipping Policy
            </Link>
            <Link
              href="/download"
              className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium"
            >
              <FaDownload className="inline mr-2" />
              Download App
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
