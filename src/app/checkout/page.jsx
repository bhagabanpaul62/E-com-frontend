"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  MapPin,
  Check,
  Edit,
  Plus,
  Truck,
  Home,
  Building,
  MapPinIcon,
  Smartphone,
} from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, totalItems, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const [addressForm, setAddressForm] = useState({
    fullname: user?.name || "",
    phone: "",
    PinCode: "",
    streetAddress: "",
    city: "",
    State: "",
    landmark: "",
    AddressType: "Home",
    isDefault: false,
  });

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (items.length === 0) {
      router.push("/cart");
    }

    // Fetch user addresses
    fetchAddresses();
  }, [items, router]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.data);
        // Set default address as selected
        const defaultAddress = data.data.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        } else if (data.data.length > 0) {
          setSelectedAddress(data.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // State to hold order totals from the backend
  const [totals, setTotals] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0,
  });

  // Fetch order totals from the backend
  const fetchOrderTotals = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/calculate-totals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTotals(data.data);
      } else {
        console.error("Failed to fetch order totals");
      }
    } catch (error) {
      console.error("Error fetching order totals:", error);
    }
  };

  // Fetch totals when component mounts or when cart changes
  useEffect(() => {
    if (user) {
      fetchOrderTotals();
    }
  }, [items, user]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const url = editingAddress
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${editingAddress._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/addresses`;

      const method = editingAddress ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });

      if (response.ok) {
        const data = await response.json();
        await fetchAddresses();
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressForm({
          fullname: user?.name || "",
          phone: "",
          PinCode: "",
          streetAddress: "",
          city: "",
          State: "",
          landmark: "",
          AddressType: "Home",
          isDefault: false,
        });

        // If it's a new address and set as default, select it
        if (!editingAddress && addressForm.isDefault) {
          setSelectedAddress(data.data);
        }
      } else {
        alert("Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await fetchAddresses();
        if (selectedAddress?._id === addressId) {
          setSelectedAddress(null);
        }
      } else {
        alert("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Failed to delete address");
    }
  };

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    setStep(2);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    setOrderLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("You need to be logged in to place an order");
        router.push("/login");
        return;
      }

      if (paymentMethod === "cod") {
        // Create order directly for COD
        const orderResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              shippingAddressId: selectedAddress._id,
              paymentMethod: "COD",
              deliveryType: "Normal",
            }),
          }
        );

        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          router.push(`/order-confirmation?orderId=${orderData.data._id}`);
        } else {
          throw new Error("Failed to create order");
        }
      } else {
        // Handle online payment with Razorpay
        const razorpayLoaded = await loadRazorpayScript();

        if (!razorpayLoaded) {
          alert("Failed to load payment gateway");
          return;
        }

        // Log request details for debugging
        console.log("Making Razorpay order request:", {
          url: `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create-razorpay-order`,
          token: token ? "Token present" : "Token missing",
        });

        // Create Razorpay order (backend will calculate the amount)
        const razorpayOrderResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create-razorpay-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              currency: "INR",
            }),
          }
        );

        // For debugging: log full response details
        console.log(
          "Razorpay response status:",
          razorpayOrderResponse.status,
          razorpayOrderResponse.statusText
        );

        // Try to get response text first for debugging
        const responseText = await razorpayOrderResponse.text();
        console.log("Razorpay raw response:", responseText);

        if (!razorpayOrderResponse.ok) {
          // Try to parse the response as JSON if possible
          let errorData;
          try {
            errorData = JSON.parse(responseText);
          } catch (e) {
            console.error("Error parsing response:", e);
            errorData = {
              message: "Error parsing response",
              raw: responseText,
            };
          }

          console.error("Razorpay order creation failed:", errorData);
          const errorMsg =
            errorData.message ||
            errorData.error ||
            razorpayOrderResponse.statusText ||
            "Unknown error";
          console.error("Detailed error:", errorMsg);
          throw new Error(`Failed to create payment order: ${errorMsg}`);
        }

        // Parse the response text as JSON
        const razorpayOrderData = JSON.parse(responseText);

        // Log the key to ensure it's available
        console.log(
          "Using Razorpay Key:",
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        );

        // Log the Razorpay order details for debugging
        console.log("Razorpay order data:", razorpayOrderData);

        // Ensure we're using the latest key directly from the environment
        console.log(
          "Setting up Razorpay payment with key:",
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        );

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayOrderData.data.amount,
          currency: razorpayOrderData.data.currency,
          name: "Tajbee",
          description: "Tajbee Order Payment",
          order_id: razorpayOrderData.data.id,
          image:
            "https://res.cloudinary.com/dtewakucf/image/upload/v1/logo.png",
          handler: async function (response) {
            try {
              console.log("Payment successful:", response);

              // Create order after successful payment
              const orderResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    shippingAddressId: selectedAddress._id,
                    paymentMethod: "ONLINE",
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    deliveryType: "Normal",
                  }),
                }
              );

              if (orderResponse.ok) {
                const orderData = await orderResponse.json();
                router.push(
                  `/order-confirmation?orderId=${orderData.data._id}`
                );
              } else {
                const errorData = await orderResponse.json().catch(() => ({}));
                console.error("Order creation failed:", errorData);
                alert(
                  `Failed to create order: ${
                    errorData.message || orderResponse.statusText
                  }`
                );
              }
            } catch (error) {
              console.error("Payment handling error:", error);
              alert(
                "There was an error processing your payment. Please try again."
              );
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: selectedAddress.phone,
          },
          theme: {
            color: "#f59e0b",
          },
          modal: {
            ondismiss: function () {
              setOrderLoading(false);
              console.log("Payment modal closed");
              alert("Payment canceled. You can try again when you're ready.");
            },
          },
          notes: {
            address: `${selectedAddress.streetAddress}, ${selectedAddress.city}, ${selectedAddress.State}`,
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      console.error("Error placing order:", error);

      // Extract and display more detailed error information
      let errorMessage = "Failed to place order. ";

      if (error.message) {
        errorMessage += error.message;
      }

      // Check for network-related errors
      if (!navigator.onLine) {
        errorMessage += " Please check your internet connection.";
      }

      // Check if it's a Razorpay-specific error
      if (error.error && error.error.description) {
        errorMessage += ` Razorpay error: ${error.error.description}`;
      }

      // Log additional details to help debug
      console.log("Razorpay Key ID:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      console.log("Order total:", totals.total);

      alert(errorMessage);
    } finally {
      setOrderLoading(false);
    }
  };

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case "Home":
        return <Home className="h-4 w-4" />;
      case "Work":
        return <Building className="h-4 w-4" />;
      default:
        return <MapPinIcon className="h-4 w-4" />;
    }
  };

  const renderAddressSelection = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Select Delivery Address</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowAddressForm(true);
              setEditingAddress(null);
              setAddressForm({
                fullname: user?.name || "",
                phone: "",
                PinCode: "",
                streetAddress: "",
                city: "",
                State: "",
                landmark: "",
                AddressType: "Home",
                isDefault: false,
              });
            }}
            className="flex items-center text-amber-600 border-amber-600 hover:bg-amber-50"
          >
            <Plus className="mr-2 w-4 h-4" />
            Add New Address
          </Button>
        </div>

        {showAddressForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h3>
            <form onSubmit={handleAddressSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={addressForm.fullname}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        fullname: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, phone: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    PIN Code
                  </label>
                  <input
                    type="number"
                    value={addressForm.PinCode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        PinCode: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={addressForm.State}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, State: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address Type
                  </label>
                  <select
                    value={addressForm.AddressType}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        AddressType: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Street Address
                </label>
                <textarea
                  value={addressForm.streetAddress}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      streetAddress: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                  rows="2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={addressForm.landmark}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, landmark: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label htmlFor="isDefault" className="text-sm">
                  Set as default address
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  {loading
                    ? "Saving..."
                    : editingAddress
                    ? "Update Address"
                    : "Save Address"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddressForm(false);
                    setEditingAddress(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedAddress?._id === address._id
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedAddress(address)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress?._id === address._id}
                    onChange={() => setSelectedAddress(address)}
                    className="mt-1 accent-amber-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getAddressTypeIcon(address.AddressType)}
                      <span className="font-medium text-sm text-gray-600 uppercase">
                        {address.AddressType}
                      </span>
                      {address.isDefault && (
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="font-medium">{address.fullname}</p>
                    <p className="text-gray-600 text-sm">
                      {address.streetAddress},{" "}
                      {address.landmark && `${address.landmark}, `}
                      {address.city}, {address.State} - {address.PinCode}
                    </p>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Smartphone className="h-3 w-3 mr-1" />
                      {address.phone}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingAddress(address);
                      setAddressForm({
                        fullname: address.fullname,
                        phone: address.phone,
                        PinCode: address.PinCode,
                        streetAddress: address.streetAddress,
                        city: address.city,
                        State: address.State,
                        landmark: address.landmark || "",
                        AddressType: address.AddressType,
                        isDefault: address.isDefault,
                      });
                      setShowAddressForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(address._id);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {addresses.length === 0 && !showAddressForm && (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No addresses found</p>
            <Button
              onClick={() => setShowAddressForm(true)}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Add Your First Address
            </Button>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Link href="/cart">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Cart
            </Button>
          </Link>

          <Button
            onClick={handleContinueToPayment}
            disabled={!selectedAddress}
            className="bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50"
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    );
  };

  const renderPaymentForm = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4">Payment Method</h2>

        <div className="space-y-3 mb-6">
          <div
            className={`border rounded-md p-3 cursor-pointer ${
              paymentMethod === "card" ? "border-amber-500 bg-amber-50" : ""
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            <div className="flex">
              <input
                type="radio"
                checked={paymentMethod === "card"}
                onChange={() => {}}
                className="mr-2 mt-0.5 accent-amber-500"
              />
              <div>
                <p className="font-medium flex items-center">
                  <CreditCard className="mr-2 w-4 h-4" />
                  Online Payment
                </p>
                <p className="text-xs text-gray-500">
                  Credit Card, Debit Card, UPI, Net Banking & more
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Secure payment via Tajbee Payment Gateway
                </p>
              </div>
            </div>
          </div>

          <div
            className={`border rounded-md p-3 cursor-pointer ${
              paymentMethod === "cod" ? "border-amber-500 bg-amber-50" : ""
            }`}
            onClick={() => setPaymentMethod("cod")}
          >
            <div className="flex">
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => {}}
                className="mr-2 mt-0.5 accent-amber-500"
              />
              <div>
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-xs text-gray-500">
                  Pay when you receive your order
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-2">
            <Lock className="mr-2 w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Secure Payment</span>
          </div>
          <p className="text-xs text-gray-600">
            Your payment information is encrypted and secure
          </p>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Address
          </Button>

          <Button
            onClick={handlePlaceOrder}
            disabled={orderLoading}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            {orderLoading
              ? "Processing..."
              : `Place Order - ₹${totals.total.toFixed(2)}`}
          </Button>
        </div>
      </div>
    );
  };

  const renderOrderSummary = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
        <h3 className="font-bold text-lg mb-4">Order Summary</h3>

        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div
              key={`${item.product?._id || item.productId}-${
                item.variantId || "default"
              }`}
              className="flex items-center space-x-3 p-2 border-b"
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={
                    item.product?.mainImage ||
                    item.product?.images?.[0] ||
                    "/api/placeholder/48/48"
                  }
                  alt={item.product?.name || "Product"}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm line-clamp-2">
                  {item.product?.name || "Product"}
                </p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ₹
                  {(
                    (item.priceAtAdd || item.product?.price) * item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm border-t pt-4">
          <div className="flex justify-between">
            <span>Items ({totalItems}):</span>
            <span>₹{totals.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping & handling:</span>
            <span>FREE</span>
          </div>
        </div>

        <div className="border-t border-b py-2 my-4">
          <div className="flex justify-between font-bold">
            <span>Order total:</span>
            <span>₹{totals.total.toFixed(2)}</span>
          </div>
        </div>

        {selectedAddress && step === 1 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 flex items-start">
            <Truck className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Delivery to:</p>
              <p>{selectedAddress.fullname}</p>
              <p>
                {selectedAddress.city}, {selectedAddress.State} -{" "}
                {selectedAddress.PinCode}
              </p>
              <p className="text-xs mt-1">
                Standard delivery: 5-7 business days
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100 text-sm text-green-800">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              <span className="font-medium">Ready to place order</span>
            </div>
            <p className="mt-1 text-xs">
              Payment method:{" "}
              {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center ${
                step >= 1 ? "text-amber-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-amber-600 text-white" : "bg-gray-200"
                }`}
              >
                {step > 1 ? <Check className="w-5 h-5" /> : "1"}
              </div>
              <span className="ml-2 font-medium">Address</span>
            </div>
            <div
              className={`w-16 h-0.5 ${
                step >= 2 ? "bg-amber-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center ${
                step >= 2 ? "text-amber-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-amber-600 text-white" : "bg-gray-200"
                }`}
              >
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && renderAddressSelection()}
            {step === 2 && renderPaymentForm()}
          </div>

          <div className="lg:col-span-1">{renderOrderSummary()}</div>
        </div>
      </div>
    </div>
  );
}
