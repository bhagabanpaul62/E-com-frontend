"use client";

import { useState } from "react";

const orders = [
  {
    id: "#12345",
    customer: "Alice Johnson",
    date: "2023-08-15",
    total: 150,
    status: "Placed",
  },
  {
    id: "#12346",
    customer: "Bob Williams",
    date: "2023-08-16",
    total: 200,
    status: "Shipped",
  },
  {
    id: "#12347",
    customer: "Charlie Brown",
    date: "2023-08-17",
    total: 100,
    status: "Delivered",
  },
  {
    id: "#12348",
    customer: "Diana Green",
    date: "2023-08-18",
    total: 250,
    status: "Placed",
  },
  {
    id: "#12349",
    customer: "Ethan White",
    date: "2023-08-19",
    total: 300,
    status: "Shipped",
  },
];

const statusTabs = ["All", "Placed", "Shipped", "Delivered"];

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchStatus =
      selectedStatus === "All" || order.status === selectedStatus;
    const matchSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Orders</h1>
      <p className="text-gray-500 mb-4">Manage your orders</p>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-200">
        {statusTabs.map((status) => (
          <button
            key={status}
            className={`pb-2 border-b-2 transition font-medium ${
              selectedStatus === status
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setSelectedStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search orders"
        className="w-full max-w-md px-4 py-2 mb-6 border border-gray-300 rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Date Placed
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Total
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      order.status === "Placed"
                        ? "bg-gray-100 text-gray-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-6 text-sm"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
