"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-amber-500">E-com</h3>
          <p className="text-sm mb-4">
            Your trusted online store for quality products and fast delivery.
          </p>
          <div className="flex gap-3 mt-2">
            <a
              href="#"
              className="p-2 rounded-full bg-white border hover:bg-amber-400 hover:text-white transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-white border hover:bg-amber-400 hover:text-white transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-white border hover:bg-amber-400 hover:text-white transition"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="font-semibold mb-3">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-amber-500 transition">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-500 transition">
                Order Tracking
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-500 transition">
                Returns & Refunds
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-500 transition">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="font-semibold mb-3">Useful Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-amber-500 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-500 transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-500 transition">
                Terms & Conditions
              </a>
            </li>
            
          </ul>
        </div>

        {/* Payment & Contact */}
        <div>
          <h4 className="font-semibold mb-3">We Accept</h4>
          <div className="flex gap-3 mb-4">
            <FaCcVisa className="text-2xl text-blue-700" />
            <FaCcMastercard className="text-2xl text-red-600" />
            <FaCcPaypal className="text-2xl text-blue-500" />
          </div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-sm">Email: support@ecom.com</p>
          <p className="text-sm">Phone: +91 12345 67890</p>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500 bg-gray-50">
        &copy; {new Date().getFullYear()} E-com. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
