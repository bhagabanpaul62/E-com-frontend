"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
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
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { use } from "react";

// Function to dynamically load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default function DirectCheckoutPage({ params }) {
  // Use React.use to unwrap the params promise in Next.js 15
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  const { user } = useSelector((state) => state.user);
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [addressLoading, setAddressLoading] = useState(false);
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
    // Fetch product details
    const fetchProductDetails = async () => {
      if (!productId) {
        console.error("No product ID available yet");
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching product with ID:", productId);
        console.log(
          "API URL:",
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`
        );

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error response:", errorText);
          throw new Error("Product not found");
        }

        const data = await response.json();
        console.log("Product data received:", data);
        setProduct(data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    // Fetch user addresses
    fetchAddresses();
    fetchProductDetails();
  }, [productId, router]);

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
      toast.error("Failed to load addresses");
    }
  };

  const calculateTotal = () => {
    if (!product) return { subtotal: 0, shipping: 0, total: 0 };

    const price = product.price;
    const finalPrice = product.discountPercentage
      ? price * (1 - product.discountPercentage / 100)
      : price;

    const subTotal = finalPrice;
    const shippingCharges = subTotal < 500 ? 40 : 0;
    const total = subTotal + shippingCharges;

    return {
      subtotal: subTotal,
      shipping: shippingCharges,
      total: total,
    };
  };

  const totals = calculateTotal();

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressLoading(true);

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

        toast.success(
          editingAddress ? "Address updated!" : "New address added!"
        );

        // If it's a new address and set as default, select it
        if (!editingAddress && addressForm.isDefault) {
          setSelectedAddress(data.data);
        }
      } else {
        toast.error("Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setAddressLoading(false);
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
        toast.success("Address deleted!");
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
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

  // Function to handle direct checkout from product page
  const handleDirectCheckout = async () => {
    if (!productId || !selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    setOrderLoading(true);

    // Log the API URL and environment variables for debugging
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("Product ID:", productId);
    console.log("Selected Address:", selectedAddress._id);

    try {
      // First fetch the product details
      const productUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`;
      console.log("Fetching product from:", productUrl);

      const productResponse = await fetch(productUrl);

      if (!productResponse.ok) {
        console.error("Product fetch error:", await productResponse.text());
        throw new Error("Failed to fetch product details");
      }

      const productData = await productResponse.json();
      console.log("Product data:", productData);
      const product = productData.data;

      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push(`/login?redirect=/direct-checkout/${productId}`);
        return;
      }

      // Process based on payment method
      if (paymentMethod === "cod") {
        // Create order directly for COD
        const orderUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create-direct`;
        console.log("Creating order at URL:", orderUrl);

        const orderPayload = {
          shippingAddressId: selectedAddress._id,
          paymentMethod: "COD",
          deliveryType: "Normal",
          productId: productId,
          quantity: 1,
        };
        console.log("Order payload:", orderPayload);

        const orderResponse = await fetch(orderUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderPayload),
        });

        // Log the raw response for debugging
        const responseText = await orderResponse.text();
        console.log("Order response status:", orderResponse.status);
        console.log("Order response:", responseText);

        if (orderResponse.ok) {
          try {
            // Parse the response as JSON
            const orderData = JSON.parse(responseText);
            console.log("Order data:", orderData);

            if (orderData && orderData.data && orderData.data._id) {
              console.log(
                "Redirecting to order confirmation:",
                `/order-confirmation?orderId=${orderData.data._id}`
              );
              router.push(`/order-confirmation?orderId=${orderData.data._id}`);
            } else {
              console.error("Invalid order data structure:", orderData);
              throw new Error("Invalid order response format");
            }
          } catch (parseError) {
            console.error("Error parsing order response:", parseError);
            throw new Error("Failed to parse order response");
          }
        } else {
          console.error(
            "Order creation failed with status:",
            orderResponse.status
          );
          throw new Error(`Failed to create order: ${responseText}`);
        }
      } else {
        // Handle online payment with Razorpay
        const razorpayLoaded = await loadRazorpayScript();

        if (!razorpayLoaded) {
          toast.error("Failed to load payment gateway");
          return;
        }

        // Calculate amount from product price
        const amount = product.price;
        const shippingCharges = amount < 500 ? 40 : 0;
        const totalAmount = amount + shippingCharges;

        // Create Razorpay order
        const razorpayOrderResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create-razorpay-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount: totalAmount,
              currency: "INR",
            }),
          }
        );

        if (!razorpayOrderResponse.ok) {
          const errorText = await razorpayOrderResponse.text();
          console.error("Razorpay error response:", errorText);
          throw new Error(
            `Failed to create payment order: ${razorpayOrderResponse.statusText}`
          );
        }

        const razorpayOrderData = await razorpayOrderResponse.json();

        // Ensure we have the Razorpay Key ID
        const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKeyId) {
          throw new Error("Razorpay key is not configured");
        }

        const options = {
          key: razorpayKeyId.trim(),
          amount: razorpayOrderData.data.amount,
          currency: razorpayOrderData.data.currency,
          name: "Your E-commerce Store",
          description: "Direct Product Purchase",
          order_id: razorpayOrderData.data.id,
          image:
            "https://res.cloudinary.com/dtewakucf/image/upload/v1/logo.png",
          handler: async function (response) {
            try {
              // Create order after successful payment
              const orderResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create-direct`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    shippingAddressId: selectedAddress._id,
                    paymentMethod: paymentMethod.toUpperCase(),
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    deliveryType: "Normal",
                    productId: productId,
                    quantity: 1,
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
                toast.error(
                  `Failed to create order: ${
                    errorData.message || orderResponse.statusText
                  }`
                );
              }
            } catch (error) {
              console.error("Payment handling error:", error);
              toast.error(
                "There was an error processing your payment. Please try again."
              );
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: selectedAddress?.phone || "",
          },
          theme: {
            color: "#f59e0b",
          },
          modal: {
            ondismiss: function () {
              setOrderLoading(false);
              toast.info(
                "Payment canceled. You can try again when you're ready."
              );
            },
          },
          notes: {
            address: selectedAddress
              ? `${selectedAddress.streetAddress}, ${selectedAddress.city}, ${selectedAddress.State}`
              : "",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      console.error("Error processing direct checkout:", error);
      toast.error(error.message || "Failed to process checkout");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <Link href="/products" className="text-amber-600 hover:underline">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2">
          <Link
            href={`/product/${productId}`}
            className="text-gray-600 hover:text-amber-600 transition-colors flex items-center gap-1 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Product
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Express Checkout
        </h1>

        {/* Stepper */}
        <div className="flex mb-8">
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full flex items-center justify-center w-8 h-8 ${
                step >= 1 ? "bg-amber-500 text-white" : "bg-gray-300"
              }`}
            >
              1
            </div>
            <span className="text-xs mt-1">Delivery</span>
          </div>
          <div className="flex-1 flex items-center">
            <div
              className={`h-1 flex-grow ${
                step >= 2 ? "bg-amber-500" : "bg-gray-300"
              }`}
            ></div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full flex items-center justify-center w-8 h-8 ${
                step >= 2 ? "bg-amber-500 text-white" : "bg-gray-300"
              }`}
            >
              2
            </div>
            <span className="text-xs mt-1">Payment</span>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div>
                {/* Address Selection */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">
                      Select Delivery Address
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddressForm(true);
                        setEditingAddress(null);
                      }}
                      className="border-amber-500 text-amber-500 hover:bg-amber-50"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Address
                    </Button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-6">
                      <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-600 mb-4">
                        You don't have any saved addresses
                      </p>
                      <Button
                        onClick={() => {
                          setShowAddressForm(true);
                          setEditingAddress(null);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        Add a new address
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          className={`border rounded-md p-4 relative ${
                            selectedAddress?._id === address._id
                              ? "border-amber-500 bg-amber-50"
                              : "hover:border-gray-400"
                          }`}
                          onClick={() => setSelectedAddress(address)}
                        >
                          <div className="flex items-center mb-2">
                            <div
                              className={`h-4 w-4 rounded-full flex items-center justify-center mr-2 ${
                                selectedAddress?._id === address._id
                                  ? "bg-amber-500"
                                  : "border border-gray-400"
                              }`}
                            >
                              {selectedAddress?._id === address._id && (
                                <div className="h-2 w-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">
                                {address.fullname}
                              </span>
                              <div className="ml-2 px-2 py-0.5 text-xs rounded-md bg-gray-200 text-gray-800 flex items-center">
                                {getAddressTypeIcon(address.AddressType)}
                                <span className="ml-1">
                                  {address.AddressType}
                                </span>
                              </div>
                              {address.isDefault && (
                                <div className="ml-2 px-2 py-0.5 text-xs rounded-md bg-amber-100 text-amber-800">
                                  Default
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-sm text-gray-700">
                            <p>{address.streetAddress}</p>
                            <p>
                              {address.city}, {address.State} -{" "}
                              {address.PinCode}
                            </p>
                            {address.landmark && (
                              <p className="text-gray-500">
                                Landmark: {address.landmark}
                              </p>
                            )}
                            <p className="mt-1 flex items-center">
                              <Smartphone className="h-3 w-3 mr-1" />
                              {address.phone}
                            </p>
                          </div>

                          <div className="absolute top-3 right-3 flex space-x-2">
                            <button
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
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(address._id);
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddressForm && (
                    <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-medium mb-4">
                        {editingAddress ? "Edit Address" : "Add New Address"}
                      </h3>
                      <form onSubmit={handleAddressSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
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
                              required
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={addressForm.phone}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  phone: e.target.value,
                                })
                              }
                              required
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Pin Code
                            </label>
                            <input
                              type="text"
                              value={addressForm.PinCode}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  PinCode: e.target.value,
                                })
                              }
                              required
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              State
                            </label>
                            <input
                              type="text"
                              value={addressForm.State}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  State: e.target.value,
                                })
                              }
                              required
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              value={addressForm.city}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  city: e.target.value,
                                })
                              }
                              required
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Landmark (Optional)
                            </label>
                            <input
                              type="text"
                              value={addressForm.landmark}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  landmark: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                              Street Address
                            </label>
                            <input
                              type="text"
                              value={addressForm.streetAddress}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  streetAddress: e.target.value,
                                })
                              }
                              required
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
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
                            >
                              <option value="Home">Home</option>
                              <option value="Work">Work</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="flex items-center mt-3">
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
                            <label
                              htmlFor="isDefault"
                              className="text-sm cursor-pointer"
                            >
                              Set as default address
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-end mt-4 space-x-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAddressForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                            disabled={addressLoading}
                          >
                            {addressLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
                            ) : editingAddress ? (
                              "Update Address"
                            ) : (
                              "Save Address"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="mt-6">
                    <Button
                      onClick={handleContinueToPayment}
                      disabled={!selectedAddress}
                      className="bg-amber-500 hover:bg-amber-600 text-white disabled:bg-gray-300"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                {/* Payment Method */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                  <div className="space-y-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        paymentMethod === "card"
                          ? "border-amber-500 bg-amber-50"
                          : ""
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                            paymentMethod === "card"
                              ? "border-amber-500"
                              : "border-gray-400"
                          }`}
                        >
                          {paymentMethod === "card" && (
                            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" /> Credit/Debit
                            Card & UPI
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Pay with any credit/debit card or UPI
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        paymentMethod === "cod"
                          ? "border-amber-500 bg-amber-50"
                          : ""
                      }`}
                      onClick={() => setPaymentMethod("cod")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                            paymentMethod === "cod"
                              ? "border-amber-500"
                              : "border-gray-400"
                          }`}
                        >
                          {paymentMethod === "cod" && (
                            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">Cash On Delivery</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Pay when your package arrives
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="border-gray-300"
                    >
                      Back to Delivery
                    </Button>
                    <Button
                      onClick={handleDirectCheckout}
                      disabled={orderLoading}
                      className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2"
                    >
                      {orderLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm mt-6 sm:mt-0">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 overflow-hidden rounded-md flex-shrink-0">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {product.name}
                    </p>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-gray-600">
                        1 x ₹{product.price.toLocaleString()}
                      </p>
                      <p className="font-medium text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </p>
                    </div>
                    {product.discountPercentage > 0 && (
                      <p className="text-xs text-green-600 mt-1">
                        {product.discountPercentage}% off
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-b py-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{totals.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>
                    {totals.shipping > 0
                      ? `₹${totals.shipping.toLocaleString()}`
                      : "FREE"}
                  </span>
                </div>
              </div>

              <div className="pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{totals.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Delivery details */}
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium text-sm mb-2">
                  Estimated Delivery:
                </h3>
                <p className="text-sm">
                  {new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <Button
                onClick={handleDirectCheckout}
                disabled={
                  step !== 2 ||
                  !selectedAddress ||
                  orderLoading ||
                  (paymentMethod !== "cod" && !window.Razorpay)
                }
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg mt-4 flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                {orderLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Place Order</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
