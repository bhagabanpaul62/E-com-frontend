"use client";

import React, { useState } from "react";

// Dummy customer data (you can fetch this from backend later)
const customers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    joined: "2024-03-12",
    status: "Active",
  },
  {
    id: 2,
    name: "Emily Smith",
    email: "emily@example.com",
    joined: "2023-11-08",
    status: "Banned",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael@example.com",
    joined: "2024-05-21",
    status: "Active",
  },
];

const CustomerList = () => {
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
      <p className="text-gray-500 mb-4">
        Manage your customers and their accounts
      </p>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search customers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-700">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-3">{customer.name}</td>
                <td className="px-4 py-3">{customer.email}</td>
                <td className="px-4 py-3">{customer.joined}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filteredCustomers.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-6 text-sm"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;
