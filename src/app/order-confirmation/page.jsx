"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { resetCart } from "@/redux/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  console.log("Order confirmation page loaded with order ID:", orderId);

  useEffect(() => {
    // Clear the cart when the confirmation page loads
    dispatch(resetCart());

    if (!orderId) {
      console.log("No order ID found in URL, redirecting to home");
      router.push("/");
      return;
    }

    console.log("Fetching order details for ID:", orderId);
    fetchOrderDetails();
  }, [orderId, router, dispatch]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No auth token found, redirecting to login");
        router.push("/login");
        return;
      }

      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      console.log(
        "Requesting order details from:",
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Order API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Order data received:", data.data);
        setOrder(data.data);
      } else {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`Failed to fetch order details: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Placed":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-yellow-100 text-yellow-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEstimatedDeliveryDate = () => {
    if (!order) return "";
    const orderDate = new Date(order.createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + (order.estimatedDays || 7));
    return deliveryDate.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The order you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button className="bg-amber-500 hover:bg-amber-600">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you a confirmation email
            shortly.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-green-800">
                  Order #{order.invoiceId}
                </h2>
                <p className="text-sm text-green-600">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Order Timeline */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Order Status</h3>
              <div className="flex items-center space-x-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Order Placed
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex-1 h-0.5 bg-gray-200"></div>

                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ["Shipped", "Delivered"].includes(order.orderStatus)
                        ? "bg-green-600"
                        : "bg-gray-200"
                    }`}
                  >
                    <Truck
                      className={`w-5 h-5 ${
                        ["Shipped", "Delivered"].includes(order.orderStatus)
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        ["Shipped", "Delivered"].includes(order.orderStatus)
                          ? "text-green-800"
                          : "text-gray-500"
                      }`}
                    >
                      Shipped
                    </p>
                    {order.trackingId && (
                      <p className="text-xs text-gray-500">
                        Tracking: {order.trackingId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-1 h-0.5 bg-gray-200"></div>

                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-600"
                        : "bg-gray-200"
                    }`}
                  >
                    <Package
                      className={`w-5 h-5 ${
                        order.orderStatus === "Delivered"
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        order.orderStatus === "Delivered"
                          ? "text-green-800"
                          : "text-gray-500"
                      }`}
                    >
                      Delivered
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.orderStatus === "Delivered"
                        ? "Delivered"
                        : `Expected: ${getEstimatedDeliveryDate()}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {order.products.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={
                          item.productId && item.productId.mainImage
                            ? item.productId.mainImage
                            : "/api/placeholder/64/64"
                        }
                        alt={
                          item.productId && item.productId.name
                            ? item.productId.name
                            : "Product"
                        }
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {item.productId && item.productId.name
                          ? item.productId.name
                          : "Product"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Delivery Address */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                  Delivery Address
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">
                    {order.shippingAddress.fullname}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.shippingAddress.streetAddress}
                    {order.shippingAddress.landmark &&
                      `, ${order.shippingAddress.landmark}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.State}{" "}
                    - {order.shippingAddress.PinCode}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Phone: {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
                  Payment Details
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Payment Method:</span>
                    <span className="text-sm">{order.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Payment Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Amount:</span>
                    <span className="text-sm font-bold">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Price Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{order.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Charges:</span>
                    <span>
                      {order.shippingCharges > 0
                        ? `₹${order.shippingCharges.toFixed(2)}`
                        : "FREE"}
                    </span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{order.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/(user)/order">
            <Link href="/order"  className="flex items-center">
              <Package className="mr-2 w-4 h-4" />
              View All Orders
            </Link>
          </Link>
          <Link href="/">
            <Button className="bg-amber-500 hover:bg-amber-600 flex items-center">
              Continue Shopping
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
