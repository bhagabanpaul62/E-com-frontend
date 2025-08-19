"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/utils";

export default function OrderDetailsPage({ params }) {
  const { id } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/orders/${id}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          } else if (response.status === 404) {
            setError("Order not found.");
            setLoading(false);
            return;
          }
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        setOrder(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, router]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusTimeline = (status) => {
    const timeline = [
      { status: "Order Placed", completed: true },
      {
        status: "Processing",
        completed: ["processing", "shipped", "delivered"].includes(
          status?.toLowerCase()
        ),
      },
      {
        status: "Shipped",
        completed: ["shipped", "delivered"].includes(status?.toLowerCase()),
      },
      { status: "Delivered", completed: status?.toLowerCase() === "delivered" },
    ];

    if (status?.toLowerCase() === "cancelled") {
      return [
        { status: "Order Placed", completed: true },
        { status: "Cancelled", completed: true },
      ];
    }

    return timeline;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-medium">Order not found</h2>
          <p className="mt-2 text-gray-500">
            The order you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Link
            href="/account"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Return to Account
          </Link>
        </div>
      </div>
    );
  }

  const timeline = getStatusTimeline(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/account"
          className="text-blue-600 hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to My Account
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Order #{id.substring(id.length - 8)}
        </h1>
        <div className="mt-2 md:mt-0 flex items-center">
          <span className="text-gray-500 mr-2">Status:</span>
          <span
            className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Order Status</h2>
        <div className="relative">
          <div
            className="absolute left-0 w-full border-t-2 border-gray-200"
            style={{ top: "40%" }}
          ></div>
          <div className="relative flex justify-between">
            {timeline.map((step, index) => (
              <div key={index} className="text-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center mx-auto ${
                    step.completed ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  {step.completed ? (
                    <svg
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="h-5 w-5 text-gray-500">{index + 1}</span>
                  )}
                </div>
                <div
                  className={`mt-2 text-xs ${
                    step.completed
                      ? "text-blue-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Order Items</h2>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <li key={item._id} className="py-4 flex">
                  <div className="flex-shrink-0 relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                    {item.product?.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.title}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          <Link
                            href={`/products/${item.product._id}`}
                            className="hover:underline"
                          >
                            {item.product.title}
                          </Link>
                        </h3>
                        {item.variant && (
                          <p className="mt-1 text-sm text-gray-500">
                            {Object.entries(item.variant).map(
                              ([key, value]) => (
                                <span key={key} className="mr-2">
                                  {key}: {value}
                                </span>
                              )
                            )}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-1">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            <div className="flow-root">
              <dl className="text-sm">
                <div className="py-2 flex justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium text-gray-900">
                    {formatPrice(order.totalAmount - (order.shippingCost || 0))}
                  </dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-gray-600">Shipping</dt>
                  <dd className="font-medium text-gray-900">
                    {formatPrice(order.shippingCost || 0)}
                  </dd>
                </div>
                {order.discount > 0 && (
                  <div className="py-2 flex justify-between">
                    <dt className="text-gray-600">Discount</dt>
                    <dd className="font-medium text-green-600">
                      -{formatPrice(order.discount)}
                    </dd>
                  </div>
                )}
                <div className="py-2 flex justify-between border-t border-gray-200">
                  <dt className="text-base font-medium text-gray-900">Total</dt>
                  <dd className="text-base font-medium text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Shipping Information</h2>
            {order.shippingAddress ? (
              <div>
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-gray-600">{order.shippingAddress.street}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.pincode}
                </p>
                <p className="text-gray-600">{order.shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-gray-500">
                No shipping information available.
              </p>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Payment Information</h2>
            <div>
              <p className="mb-1">
                <span className="text-gray-600">Payment Method:</span>{" "}
                {order.paymentMethod}
              </p>
              <p className="mb-1">
                <span className="text-gray-600">Payment Status:</span>{" "}
                {order.paymentStatus}
              </p>
              <p>
                <span className="text-gray-600">Order Date:</span>{" "}
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => {
            /* Handle download invoice */
          }}
        >
          Download Invoice
        </button>
        {order.status.toLowerCase() === "delivered" && (
          <button
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            onClick={() => {
              /* Handle return/refund */
            }}
          >
            Return or Replace
          </button>
        )}
        <button
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          onClick={() => {
            /* Handle help/support */
          }}
        >
          Need Help?
        </button>
      </div>
    </div>
  );
}
