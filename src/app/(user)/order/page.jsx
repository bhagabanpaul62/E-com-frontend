"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MapPin,
  Calendar,
  CreditCard,
  Eye,
  Download,
  Star,
  X,
  ChevronRight,
  Package2,
  ShoppingBag,
  MoreVertical,
  FileText,
  RotateCcw,
  MessageCircle,
  Phone,
  Mail,
  Shield,
  Award,
  TrendingUp,
  Archive,
  RefreshCw,
  SortDesc,
  Grid3X3,
  List,
  Zap,
  AlertCircle,
  Info,
  Heart,
  Share2,
  ExternalLink,
  Copy,
} from "lucide-react";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [dateRange, setDateRange] = useState("all");
  const [error, setError] = useState(null);

  // Fetch orders from your API
  useEffect(() => {
    // Create AbortController for clean cancellation
    const controller = new AbortController();
    let isMounted = true; // Track if component is mounted

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get base URL with fallback
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SERVER;

        // Get authentication token
        const token = localStorage.getItem("accessToken");

        // Use direct fetch instead of apiRequest to properly handle the AbortController
        const response = await fetch(`${baseUrl}/api/orders`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          signal: controller.signal, // Pass the abort signal directly
        });

        // Process successful response
        const responseData = await response.json();
        console.log("API response:", responseData);

        // Only update state if component is still mounted
        if (isMounted) {
          // Extract orders from the correct path in the response
          // The API returns { statuscode, data: { orders or nested data }, message, success }
          let ordersData = [];

          if (responseData.success && responseData.data) {
            // Check if data.data is an array (direct orders array)
            if (Array.isArray(responseData.data)) {
              ordersData = responseData.data;
            }
            // Check if data.data.orders is an array (nested orders array)
            else if (
              responseData.data.orders &&
              Array.isArray(responseData.data.orders)
            ) {
              ordersData = responseData.data.orders;
            }
            // Check if data.data itself is an object containing order properties
            else if (
              typeof responseData.data === "object" &&
              responseData.data !== null
            ) {
              // If data contains order-like objects, convert to array
              const possibleOrders = Object.values(responseData.data).filter(
                (item) => typeof item === "object" && item !== null
              );

              if (possibleOrders.length > 0) {
                ordersData = possibleOrders;
              }
            }
          }

          console.log("Extracted orders data:", ordersData);
          setOrders(ordersData);
        }
      } catch (err) {
        // Don't process errors if request was aborted due to unmounting
        if (err.name === "AbortError") {
          console.log("Request was aborted during unmount");
          return; // Don't set error state when component is unmounting
        }

        console.error("Error fetching orders:", err);

        // Ensure orders is reset to an empty array on error
        if (isMounted) {
          setOrders([]);
        }

        // Only update error state if component is still mounted
        if (isMounted) {
          // Handle different error types with appropriate messages
          if (err.message?.includes("401")) {
            // Handle authentication error
            setError("Authentication error. Please log in again.");
            window.location.href = "/login";
          } else if (err.message?.includes("404")) {
            setError("Orders not found. Please try again later.");
          } else if (err.message?.includes("500")) {
            setError(
              "We're experiencing technical difficulties. Our team has been notified."
            );
          } else if (err.message?.includes("JSON")) {
            setError(
              "Unable to process response from server. Please try again later."
            );
            console.error("JSON parsing error:", err);
          } else {
            // Generic error handling
            setError("Unable to load your orders. Please try again later.");
          }
        }

        // Log detailed error information for debugging
        console.debug({
          errorName: err.name,
          errorMessage: err.message,
          errorStack: err.stack,
        });

        // Use mock data only in development mode
        if (process.env.NODE_ENV === "development") {
          console.log("Using mock orders data for development");
          const mockOrders = [
            {
              _id: "1",
              invoiceId: "ORD-2025-089234",
              orderStatus: "Delivered",
              paymentStatus: "Success",
              paymentMethod: "CARD",
              totalAmount: 4299,
              subTotal: 3799,
              shippingCharges: 0,
              discountAmount: 500,
              taxAmount: 684,
              createdAt: "2025-08-15T10:30:00Z",
              deliveredAt: "2025-08-18T14:20:00Z",
              estimatedDays: 3,
              actualDays: 3,
              trackingId: "EKART789456123",
              courierPartner: "Ekart Logistics",
              priority: "Express",
              rating: 5,
              products: [
                {
                  productId: {
                    name: "Premium Wireless Headphones",
                    mainImage:
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
                    images: [
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
                    ],
                    brand: "Tajbee",
                    category: "Electronics",
                    variants: [
                      {
                        _id: "var123456789",
                        attributes: {
                          color: "Black",
                          connectivity: "Wireless",
                        },
                      },
                    ],
                  },
                  quantity: 1,
                  price: 3799,
                  originalPrice: 4299,
                  variantId: "var123456789",
                  warranty: "1 Year Warranty",
                },
              ],
              shippingAddress: {
                fullName: "Arjun Sharma",
                addressLine1: "Tower B, 1203, Phoenix Palladium",
                addressLine2: "Lower Parel",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400013",
                phone: "+91 98765 43210",
              },
              returnEligible: false,
              reviewSubmitted: true,
              orderNotes:
                "Delivered to security guard. Customer was not available.",
            },
            {
              _id: "2",
              invoiceId: "ORD-2025-089235",
              orderStatus: "Shipped",
              paymentStatus: "Success",
              paymentMethod: "UPI",
              totalAmount: 2899,
              subTotal: 2499,
              shippingCharges: 99,
              discountAmount: 200,
              taxAmount: 450,
              createdAt: "2025-08-20T14:15:00Z",
              estimatedDays: 5,
              trackingId: "BLUEDART456789123",
              courierPartner: "BlueDart Express",
              priority: "Standard",
              products: [
                {
                  productId: {
                    name: "Smart Fitness Watch",
                    mainImage:
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
                    images: [
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
                    ],
                    brand: "Tajbee",
                    category: "Wearables",
                    variants: [
                      {
                        _id: "var987654321",
                        attributes: { color: "Black", size: "42mm" },
                      },
                    ],
                  },
                  quantity: 1,
                  price: 2499,
                  originalPrice: 2999,
                  variantId: "var987654321",
                  warranty: "1 Year International Warranty",
                },
              ],
              shippingAddress: {
                fullName: "Priya Patel",
                addressLine1: "A-404, Sterling Heights",
                addressLine2: "Bandra West",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400050",
                phone: "+91 87654 32109",
              },
              returnEligible: true,
              reviewSubmitted: false,
              expectedDelivery: "2025-08-25T18:00:00Z",
            },
          ];
          if (isMounted) {
            setOrders(mockOrders);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Execute the fetch operation
    fetchOrders();

    // Return cleanup function to handle component unmounting
    return () => {
      // Set the mounted flag to false to prevent state updates after unmount
      isMounted = false;
      // Abort any in-flight requests when component unmounts
      controller.abort();
    };
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "Shipped":
        return <Truck className="h-4 w-4 text-orange-600" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Cancelled":
        return <X className="h-4 w-4 text-red-600" />;
      case "Returned":
        return <RotateCcw className="h-4 w-4 text-purple-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-200";
      case "Shipped":
        return "bg-orange-50 text-orange-700 border-orange-200 ring-1 ring-orange-200";
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200 ring-1 ring-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-200";
      case "Returned":
        return "bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 ring-1 ring-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Express":
        return "bg-red-100 text-red-800 border-red-200";
      case "Standard":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Helper function to get product image
  const getProductImage = (product) => {
    if (!product)
      return "https://placehold.co/300x300/e2e8f0/1e293b?text=No+Image";

    return (
      product.mainImage ||
      (product.images && product.images.length > 0
        ? product.images[0]
        : "https://placehold.co/300x300/e2e8f0/1e293b?text=No+Image")
    );
  };

  // Helper function to get variant details
  const getVariantDetails = (product, variantId) => {
    if (!product || !variantId) return "No variant information";

    // Check if product has variants array and find the matching variant
    if (product.variants && Array.isArray(product.variants)) {
      const variant = product.variants.find((v) => v._id === variantId);
      if (variant && variant.attributes) {
        return Object.entries(variant.attributes)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
      }
    }

    // Fallback: Check if variantId is directly an object with properties
    if (typeof variantId === "object" && variantId !== null) {
      return Object.entries(variantId)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    }

    return "Variant details not available";
  };

  // Ensure orders is an array before filtering
  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders = safeOrders.filter((order) => {
    // Protect against null or undefined order objects
    if (!order) return false;

    const matchesSearch =
      (order.invoiceId || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.products || []).some(
        (p) =>
          (p.productId?.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (p.productId?.brand || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "All" || order.orderStatus === statusFilter;

    // Date range filtering
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    let matchesDate = true;

    if (dateRange === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = orderDate >= weekAgo;
    } else if (dateRange === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = orderDate >= monthAgo;
    } else if (dateRange === "3months") {
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      matchesDate = orderDate >= threeMonthsAgo;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sorting logic - add safety check
  const sortedOrders = Array.isArray(filteredOrders)
    ? [...filteredOrders].sort((a, b) => {
        if (!a || !b) return 0; // Safety check for null/undefined items

        switch (sortBy) {
          case "newest":
            return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
          case "oldest":
            return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
          case "amount-high":
            return (b?.totalAmount || 0) - (a?.totalAmount || 0);
          case "amount-low":
            return (a?.totalAmount || 0) - (b?.totalAmount || 0);
          case "status":
            return (a?.orderStatus || "").localeCompare(b?.orderStatus || "");
          default:
            return 0;
        }
      })
    : [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Enhanced Order Details Modal with Tajbee theme
  const OrderDetailsModal = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h2>
                <p className="text-gray-600">Order ID: {order.invoiceId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Status Timeline */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-amber-600" />
              Order Progress
            </h3>
            <div className="relative">
              <div className="flex items-center justify-between">
                {/* Processing */}
                <div
                  className={`flex flex-col items-center z-10 ${
                    ["Processing", "Shipped", "Delivered"].includes(
                      order.orderStatus
                    )
                      ? "text-amber-600"
                      : "text-gray-400"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-current flex items-center justify-center mb-2 ring-4 ring-white shadow-lg">
                    <Package2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">Processing</span>
                  <span className="text-xs text-gray-500 mt-1">
                    Order confirmed
                  </span>
                </div>

                {/* Shipped */}
                <div
                  className={`flex flex-col items-center z-10 ${
                    ["Shipped", "Delivered"].includes(order.orderStatus)
                      ? "text-amber-600"
                      : "text-gray-400"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-current flex items-center justify-center mb-2 ring-4 ring-white shadow-lg">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">Shipped</span>
                  <span className="text-xs text-gray-500 mt-1">On the way</span>
                </div>

                {/* Delivered */}
                <div
                  className={`flex flex-col items-center z-10 ${
                    order.orderStatus === "Delivered"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-current flex items-center justify-center mb-2 ring-4 ring-white shadow-lg">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">Delivered</span>
                  <span className="text-xs text-gray-500 mt-1">
                    Order completed
                  </span>
                </div>
              </div>

              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 -z-10">
                <div
                  className={`h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 ${
                    order.orderStatus === "Processing"
                      ? "w-0"
                      : order.orderStatus === "Shipped"
                      ? "w-1/2"
                      : order.orderStatus === "Delivered"
                      ? "w-full"
                      : "w-0"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-amber-600" />
              Items Ordered
            </h3>
            <div className="grid gap-4">
              {order.products.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-amber-50 rounded-xl border border-amber-100 hover:shadow-md transition-shadow"
                >
                  <img
                    src={getProductImage(product.productId)}
                    alt={product.productId.name}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/300x300/e2e8f0/1e293b?text=No+Image";
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {product.productId.name}
                    </h4>
                    <p className="text-sm text-amber-600 font-medium">
                      {product.productId.brand}
                    </p>
                    {product.variantId && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(() => {
                          const variantDetails = getVariantDetails(
                            product.productId,
                            product.variantId
                          );
                          if (
                            !variantDetails ||
                            variantDetails === "No variant information" ||
                            variantDetails === "Variant details not available"
                          ) {
                            return (
                              <span className="inline-block bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded text-xs">
                                Standard
                              </span>
                            );
                          }

                          return variantDetails.split(", ").map((detail, i) => (
                            <span
                              key={i}
                              className="inline-block bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded text-xs"
                            >
                              {detail}
                            </span>
                          ));
                        })()}
                      </div>
                    )}
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-sm text-gray-600">
                        Qty: {product.quantity}
                      </span>
                      {product.warranty && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          <Shield className="h-3 w-3 inline mr-1" />
                          {product.warranty}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </p>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <p className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Shipping Information */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                Shipping Address
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.fullName}
                  </p>
                </div>
                <div className="pl-5 space-y-1 text-gray-600">
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    - {order.shippingAddress.pincode}
                  </p>
                  {order.shippingAddress.phone && (
                    <p className="flex items-center mt-2">
                      <Phone className="h-4 w-4 mr-2" />
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ₹{order.subTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shippingCharges === 0 ? (
                      <span className="text-green-600 font-bold">FREE</span>
                    ) : (
                      `₹${order.shippingCharges.toLocaleString()}`
                    )}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">
                      -₹{order.discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                {order.taxAmount && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      ₹{order.taxAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Tracking Info */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Payment Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
                Payment Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium bg-white px-3 py-1 rounded-lg">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.paymentStatus === "Success"
                        ? "bg-green-100 text-green-800"
                        : order.paymentStatus === "Pending"
                        ? "bg-amber-100 text-amber-800"
                        : order.paymentStatus === "Refunded"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                {order.refundAmount && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Refund:</span>
                    <span className="font-medium text-blue-600">
                      ₹{order.refundAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tracking Information */}
            {order.trackingId && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-orange-600" />
                  Tracking Info
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tracking ID:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm bg-white px-2 py-1 rounded">
                        {order.trackingId}
                      </span>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Copy className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Courier:</span>
                    <span className="font-medium">{order.courierPartner}</span>
                  </div>
                  {order.expectedDelivery && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Expected:</span>
                      <span className="font-medium text-green-600">
                        {formatDate(order.expectedDelivery)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
            <button className="flex-1 sm:flex-none bg-amber-400 text-white px-6 py-3 rounded-xl hover:bg-amber-500 transition-colors flex items-center justify-center space-x-2 font-medium">
              <Download className="h-4 w-4" />
              <span>Download Invoice</span>
            </button>

            {order.trackingId && (
              <button className="flex-1 sm:flex-none bg-orange-100 text-orange-700 px-6 py-3 rounded-xl hover:bg-orange-200 transition-colors flex items-center justify-center space-x-2 font-medium">
                <ExternalLink className="h-4 w-4" />
                <span>Track Package</span>
              </button>
            )}

            {order.orderStatus === "Delivered" && !order.reviewSubmitted && (
              <button className="flex-1 sm:flex-none bg-green-100 text-green-700 px-6 py-3 rounded-xl hover:bg-green-200 transition-colors flex items-center justify-center space-x-2 font-medium">
                <Star className="h-4 w-4" />
                <span>Write Review</span>
              </button>
            )}

            {order.returnEligible && (
              <button className="flex-1 sm:flex-none bg-purple-100 text-purple-700 px-6 py-3 rounded-xl hover:bg-purple-200 transition-colors flex items-center justify-center space-x-2 font-medium">
                <RotateCcw className="h-4 w-4" />
                <span>Return Item</span>
              </button>
            )}

            <button className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 font-medium">
              <MessageCircle className="h-4 w-4" />
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your orders...
          </p>
          <p className="text-sm text-gray-500">This might take a few seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Enhanced Header with Tajbee Theme */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header */}
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl shadow-lg">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-600 bg-clip-text text-transparent">
                    My Orders
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Track, manage and review your purchases
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {orders.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {
                        (Array.isArray(orders) ? orders : []).filter(
                          (o) => o?.orderStatus === "Delivered"
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Delivered</div>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">
                      ₹
                      {orders
                        .reduce((sum, order) => sum + order.totalAmount, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                </div>

                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards - Mobile */}
          <div className="sm:hidden pb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-gray-900">
                  {orders.length}
                </div>
                <div className="text-xs text-gray-600">Orders</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600">
                  {
                    (Array.isArray(orders) ? orders : []).filter(
                      (o) => o?.orderStatus === "Delivered"
                    ).length
                  }
                </div>
                <div className="text-xs text-gray-600">Delivered</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-amber-600">
                  ₹
                  {(
                    orders.reduce((sum, order) => sum + order.totalAmount, 0) /
                    1000
                  ).toFixed(1)}
                  k
                </div>
                <div className="text-xs text-gray-600">Spent</div>
              </div>
            </div>
          </div>

          {/* Advanced Search and Filters */}
          <div className="pb-6">
            <div className="bg-amber-50 rounded-xl p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-600" />
                <input
                  type="text"
                  placeholder="Search by order ID, product name, or brand..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-3">
                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                  <select
                    className="pl-10 pr-8 py-2 bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                  <select
                    className="pl-10 pr-8 py-2 bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="3months">Last 3 Months</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="relative">
                  <SortDesc className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                  <select
                    className="pl-10 pr-8 py-2 bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount-high">Amount: High to Low</option>
                    <option value="amount-low">Amount: Low to High</option>
                    <option value="status">By Status</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-white border border-amber-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-amber-100 text-amber-600"
                        : "text-gray-400 hover:text-amber-600"
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-amber-100 text-amber-600"
                        : "text-gray-400 hover:text-amber-600"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Clear Filters */}
                {(searchTerm ||
                  statusFilter !== "All" ||
                  dateRange !== "all" ||
                  sortBy !== "newest") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("All");
                      setDateRange("all");
                      setSortBy("newest");
                    }}
                    className="px-3 py-2 text-sm text-amber-700 hover:text-amber-800 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        {sortedOrders.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing {sortedOrders.length} of{" "}
              {Array.isArray(orders) ? orders.length : 0} orders
              {searchTerm && (
                <span className="text-amber-600 font-medium">
                  {" "}
                  for "{searchTerm}"
                </span>
              )}
            </p>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
            <p className="text-sm text-red-600 ml-7 mb-3">
              The server might be down or the API endpoint may have changed.
              Please try again later.
            </p>
            <div className="ml-7">
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Orders Display */}
        {sortedOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-12 w-12 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "All" || dateRange !== "all"
                  ? "Try adjusting your search or filter criteria to find what you're looking for."
                  : "You haven't placed any orders yet. Start shopping to see your orders here!"}
              </p>
              {searchTerm || statusFilter !== "All" || dateRange !== "all" ? (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("All");
                    setDateRange("all");
                  }}
                  className="inline-flex items-center px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Filters
                </button>
              ) : (
                <a
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Start Shopping
                </a>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                : "space-y-4"
            }`}
          >
            {sortedOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group"
              >
                {/* Order Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.orderStatus)}
                          <span>{order.orderStatus}</span>
                        </div>
                      </div>
                      {order.priority === "Express" && (
                        <div className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          Express
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-mono text-sm font-semibold text-gray-900">
                        {order.invoiceId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(order.createdAt)}</span>
                    {order.deliveredAt && (
                      <>
                        <span>•</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">
                          Delivered {formatDate(order.deliveredAt)}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Products */}
                  <div className="space-y-3">
                    {order.products
                      .slice(0, viewMode === "grid" ? 1 : 2)
                      .map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <img
                            src={getProductImage(product.productId)}
                            alt={product.productId.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/300x300/e2e8f0/1e293b?text=No+Image";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                              {product.productId.name}
                            </h4>
                            <p className="text-sm text-amber-600 font-medium">
                              {product.productId.brand}
                            </p>
                            {product.variantId && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(() => {
                                  const variantDetails = getVariantDetails(
                                    product.productId,
                                    product.variantId
                                  );
                                  if (
                                    !variantDetails ||
                                    variantDetails ===
                                      "No variant information" ||
                                    variantDetails ===
                                      "Variant details not available"
                                  ) {
                                    return (
                                      <span className="inline-block bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded text-xs">
                                        Standard
                                      </span>
                                    );
                                  }

                                  return variantDetails
                                    .split(", ")
                                    .map((detail, i) => (
                                      <span
                                        key={i}
                                        className="inline-block bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded text-xs"
                                      >
                                        {detail}
                                      </span>
                                    ));
                                })()}
                              </div>
                            )}
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-600">
                                Qty: {product.quantity}
                              </span>
                              {product.warranty && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Warranty
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ₹{product.price.toLocaleString()}
                            </p>
                            {product.originalPrice &&
                              product.originalPrice > product.price && (
                                <p className="text-xs text-gray-500 line-through">
                                  ₹{product.originalPrice.toLocaleString()}
                                </p>
                              )}
                          </div>
                        </div>
                      ))}
                    {order.products.length > (viewMode === "grid" ? 1 : 2) && (
                      <p className="text-sm text-amber-600 font-medium pl-20">
                        +{order.products.length - (viewMode === "grid" ? 1 : 2)}{" "}
                        more items
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 bg-amber-50 border-t border-amber-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <CreditCard className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {order.paymentMethod}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            order.paymentStatus === "Success"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "Pending"
                              ? "bg-amber-100 text-amber-700"
                              : order.paymentStatus === "Refunded"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
                        className="bg-amber-400 text-white px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors flex items-center space-x-2 text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>

                      {order.trackingId && (
                        <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors flex items-center space-x-2 text-sm font-medium">
                          <Package className="h-4 w-4" />
                          <span>Track</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Additional Quick Actions */}
                  <div className="mt-3 pt-3 border-t border-amber-200 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      {order.orderStatus === "Delivered" && order.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-amber-400 fill-current" />
                          <span>{order.rating}/5</span>
                        </div>
                      )}
                      {order.returnEligible && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          Return eligible
                        </span>
                      )}
                      {order.courierPartner && (
                        <span>{order.courierPartner}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {order.orderStatus === "Delivered" &&
                        !order.reviewSubmitted && (
                          <button className="text-amber-600 hover:text-amber-700 transition-colors p-1">
                            <Star className="h-4 w-4" />
                          </button>
                        )}
                      <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderPage;
