"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function Page() {
  const searchParam = useSearchParams();
  const emailID = searchParam.get("email");
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: emailID || "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.match(/^\d{10}$/))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/users/register`,
        formData
      );
      console.log("Success:", res.data);
      router.push("/");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-50 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg border border-gray-100 transition-all"
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Create your account
        </h2>

        {serverError && (
          <p className="text-red-600 text-sm text-center mb-4">{serverError}</p>
        )}

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 text-sm rounded-lg border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 ${
              errors.name ? "focus:ring-red-400" : "focus:ring-yellow-500"
            } transition-all`}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-3 text-sm bg-gray-100 rounded-lg border border-gray-300 cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            maxLength={10}
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 text-sm rounded-lg border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 ${
              errors.phone ? "focus:ring-red-400" : "focus:ring-yellow-500"
            } transition-all`}
            placeholder="1234567890"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 text-sm rounded-lg border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 ${
              errors.password ? "focus:ring-red-400" : "focus:ring-yellow-500"
            } transition-all`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-3 rounded-lg font-semibold text-sm shadow-sm transition duration-200 ${
            loading
              ? "bg-yellow-300 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing, you agree to our{" "}
          <a href="#" className="text-yellow-600 hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-yellow-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
