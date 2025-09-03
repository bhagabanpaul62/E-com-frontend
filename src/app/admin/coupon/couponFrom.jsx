"use client";

import { useState } from "react";

export default function CouponForm() {
  const [fromData, setFormData] = useState({
    code: "",
    discountType: "",
    amount: 0,
    minPurchase: 0,
    maxDiscountAmount: 0,
    expiresAt: "",
    maxUsageLimit: 0,
    userUsageLimit: 0,
    status: "",
  });

  const handelSubmit = (e) => {
    e.preventDefault();
    console.log("submited");
    console.log("from data value :: ", fromData);
  };

  return (
    <div className="md:px-20 md:py-20 flex items-start justify-center  ">
      <div className="w-full p-10 border-2 rounded-md shadow">
        <h1 className="font-bold text-3xl font-sans mb-8">Create Coupon</h1>

        <form onSubmit={(e) => handelSubmit(e)} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Code
            </label>
            <input
              type="text"
              placeholder="Enter coupon code"
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500"
              value={fromData.code}
              onChange={(e) => {
                setFormData({ ...fromData, code: e.target.value });
              }}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Discount Type
            </label>
            <select
              value={fromData.discountType}
              onChange={(e) => {
                setFormData({ ...fromData, discountType: e.target.value });
              }}
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              placeholder="Enter discount amount"
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500"
              value={fromData.amount}
              onChange={(e) => {
                setFormData({ ...fromData, amount: e.target.value });
              }}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Minimum Purchase
            </label>
            <input
              type="number"
              placeholder=""
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500"
              value={fromData.minPurchase}
              onChange={(e) => {
                setFormData({ ...fromData, minPurchase: e.target.value });
              }}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Maximum Discount Amount
            </label>
            <input
              type="number"
              placeholder="Enter maximum discount amount"
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500"
              value={fromData.maxDiscountAmount}
              onChange={(e) => {
                setFormData({ ...fromData, maxDiscountAmount: e.target.value });
              }}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Expiration Date
            </label>
            <input
              type="date"
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500"
              value={fromData.expiresAt}
              onChange={(e) => {
                setFormData({ ...fromData, expiresAt: e.target.value });
              }}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Maximum Usage Limit
            </label>
            <input
              type="number"
              placeholder="Enter maximum usage limit"
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500"
              value={fromData.maxUsageLimit}
              onChange={(e) => {
                setFormData({ ...fromData, maxUsageLimit
                  
                  
                  
                  : e.target.value });
              }}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              User Usage Limit
            </label>
            <input
              type="number"
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500"
              value={fromData.userUsageLimit}
              onChange={
                (e)=>{
                  setFormData({...fromData,userUsageLimit : e.target.value})
                }
              }
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Status
            </label>
            <select className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500"
            value={fromData.value}
            onChange={
              (e)=>{
                setFormData({...fromData,status:e.target.value})
              }
            }
            >
              <option value="">Select</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="text-right pt-4">
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md font-medium shadow"
            >
              Create Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
