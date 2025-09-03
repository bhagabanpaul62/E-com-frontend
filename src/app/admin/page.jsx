import React from "react";

const CustomerDashboard = () => {
  return (
    <div className="p-6 space-y-10 bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Orders Today */}
      <div className="border rounded-lg p-6 bg-white shadow-sm w-full max-w-md">
        <p className="text-gray-600">Orders Today</p>
        <p className="text-2xl font-semibold mt-1">23</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 rounded-lg p-6">
          <p className="text-gray-500">Total Orders</p>
          <p className="text-2xl font-semibold mt-1">1,234</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-6">
          <p className="text-gray-500">Revenue</p>
          <p className="text-2xl font-semibold mt-1">$56,789</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-6">
          <p className="text-gray-500">Users</p>
          <p className="text-2xl font-semibold mt-1">567</p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Low Stock Alerts</h2>
        <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Eco-Friendly Water Bottle", stock: 5, price: "$15" },
                { name: "Organic Cotton T-Shirt", stock: 2, price: "$25" },
                { name: "Recycled Paper Notebook", stock: 10, price: "$5" },
              ].map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3 text-blue-600 font-medium">
                    {item.stock}
                  </td>
                  <td className="px-4 py-3">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Signups / Reviews */}
      <div>
        <h2 className="text-xl font-semibold mb-4">New Signups / Reviews</h2>
        <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Activity</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  user: "Sophia Clark",
                  activity: "Signed up",
                  date: "2023-09-20",
                },
                {
                  user: "Liam Carter",
                  activity: "Left a review",
                  date: "2023-09-19",
                },
              ].map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3">{item.user}</td>
                  <td className="px-4 py-3 text-blue-600 underline">
                    {item.activity}
                  </td>
                  <td className="px-4 py-3">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
