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
  Minus,
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

  // Add variant support
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Calculate product price based on discount and variant
  const getCurrentPrice = () => {
    if (!product) return 0;

    let basePrice = product.price || 0;

    // Use variant price if available
    if (selectedVariant && selectedVariant.price) {
      basePrice = selectedVariant.price;
    }

    // Apply discount if available
    if (product.discountPercentage && product.discountPercentage > 0) {
      const discountAmount = (basePrice * product.discountPercentage) / 100;
      basePrice = basePrice - discountAmount;
    }

    return basePrice;
  };

  // State to hold direct checkout order totals
  const [checkoutTotals, setCheckoutTotals] = useState({
    subtotal: 0,
    shipping: 0, // Keeping for structure compatibility, but will always be 0
    total: 0,
    isBuyNow: true,
  });

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
    // Check for buyNowData in localStorage
    const getBuyNowData = () => {
      if (typeof window !== "undefined") {
        const buyNowDataStr = localStorage.getItem("buyNowData");
        if (buyNowDataStr) {
          try {
            return JSON.parse(buyNowDataStr);
          } catch (e) {
            console.error("Failed to parse buyNowData:", e);
          }
        }
      }
      return null;
    };

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

        // Check for buy now data first
        const buyNowData = getBuyNowData();
        if (buyNowData && buyNowData.productId === productId) {
          console.log("Using buyNowData from localStorage:", buyNowData);

          // Set quantity from saved data
          setQuantity(buyNowData.quantity || 1);

          // Continue with API fetch to get complete product details
        }

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

        // Set selected variant based on buyNowData if available
        if (buyNowData && buyNowData.variantId && data.data.variants) {
          const savedVariant = data.data.variants.find(
            (v) => v._id === buyNowData.variantId
          );
          if (savedVariant) {
            setSelectedVariant(savedVariant);
          } else {
            // Fallback to default variant selection
            setDefaultVariant(data.data);
          }
        } else {
          // Default variant selection
          setDefaultVariant(data.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    // Helper function to set default variant
    const setDefaultVariant = (productData) => {
      if (productData.variants && productData.variants.length > 0) {
        const defaultVariant =
          productData.variants.find((v) => v.isDefault) ||
          productData.variants[0];
        setSelectedVariant(defaultVariant);
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
    if (!product) return { subtotal: 0, shipping: 0, total: 0, isBuyNow: true };

    // Use our getCurrentPrice function to get the price with variant and discount applied
    const finalPrice = getCurrentPrice();

    const subTotal = finalPrice * quantity;
    // No shipping charges for direct checkout
    const shippingCharges = 0;
    const total = subTotal;

    // Update the checkout totals state
    if (
      checkoutTotals.subtotal !== subTotal ||
      checkoutTotals.total !== total
    ) {
      setCheckoutTotals({
        subtotal: subTotal,
        shipping: 0,
        total: total,
        isBuyNow: true,
      });
    }

    return {
      subtotal: subTotal,
      shipping: 0,
      total: total,
      isBuyNow: true,
    };
  };

  // Recalculate totals whenever relevant values change
  useEffect(() => {
    if (product) {
      calculateTotal();
    }
  }, [product, selectedVariant, quantity]);

  // For backward compatibility with existing code
  const totals = checkoutTotals;

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

  // Function to handle direct checkout from product page (similar to handlePlaceOrder in checkout page)
  const handleDirectCheckout = async () => {
    if (!productId || !selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    setOrderLoading(true);

    // Show processing toast with appropriate message based on payment method
    const toastMessage =
      paymentMethod === "cod"
        ? "Processing your order..."
        : "Preparing secure payment...";
    const processToast = toast.loading(toastMessage);

    // Log the API URL and environment variables for debugging
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("Product ID:", productId);
    console.log("Selected Address:", selectedAddress._id);
    console.log("Payment Method:", paymentMethod);

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
        toast.dismiss(processToast);
        router.push(`/login?redirect=/direct-checkout/${productId}`);
        return;
      }

      // Process based on payment method
      if (paymentMethod === "cod") {
        try {
          // Create order directly for COD
          const orderUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create-direct`;
          console.log("Creating order at URL:", orderUrl);

          const orderPayload = {
            shippingAddressId: selectedAddress._id,
            paymentMethod: "COD",
            deliveryType: "Normal",
            productId: productId,
            quantity: quantity,
            variantId: selectedVariant?._id,
            productDetails: {
              name: product.name,
              mainImage: product.mainImage,
              variantDetails: selectedVariant
                ? selectedVariant.attributes
                : null,
            },
          };
          console.log("Order payload:", orderPayload);

          // Set a timeout for the fetch operation
          const timeoutDuration = 30000; // 30 seconds

          // Create an AbortController to handle timeouts
          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            timeoutDuration
          );

          try {
            const orderResponse = await fetch(orderUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(orderPayload),
              signal: controller.signal,
            });

            // Clear the timeout since the request completed
            clearTimeout(timeoutId);

            // Get the response text for further processing
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
                  // Dismiss processing toast
                  toast.dismiss(processToast);
                  toast.success(
                    "Order placed successfully! Your package will arrive soon."
                  );

                  // Clean up buyNowData from localStorage
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("buyNowData");
                  }

                  // Small delay before redirect for better UX
                  setTimeout(() => {
                    router.push(
                      `/order-confirmation?orderId=${orderData.data._id}`
                    );
                  }, 1000);
                } else {
                  console.error("Invalid order data structure:", orderData);
                  throw new Error("Invalid order response format");
                }
              } catch (parseError) {
                console.error("Error parsing order response:", parseError);
                throw new Error("Failed to parse order response");
              }
            } else {
              // Handle specific error codes
              let errorMessage = "Failed to create order";
              if (orderResponse.status === 400) {
                errorMessage =
                  "Invalid order information. Please check your details.";
              } else if (orderResponse.status === 401) {
                errorMessage = "Please log in again to place your order.";
              } else if (orderResponse.status === 500) {
                errorMessage = "Server error. Please try again later.";
              }

              console.error(
                "Order creation failed with status:",
                orderResponse.status
              );
              throw new Error(errorMessage);
            }
          } catch (fetchError) {
            // Check if this was a timeout error
            if (fetchError.name === "AbortError") {
              throw new Error("Request timed out. Please try again.");
            }
            throw fetchError;
          }
        } catch (codError) {
          console.error("COD order creation error:", codError);
          toast.dismiss(processToast);
          toast.error(codError.message || "Failed to create COD order");
          setOrderLoading(false);
          return;
        }
      } else {
        // Handle online payment with Razorpay
        const razorpayLoaded = await loadRazorpayScript();

        if (!razorpayLoaded) {
          toast.dismiss(processToast);
          toast.error(
            "Failed to load payment gateway. Please check your internet connection and try again."
          );
          setOrderLoading(false);
          return;
        }

        // Create Razorpay order - let the server calculate the amount
        console.log("Creating direct Razorpay order for product:", productId);

        const orderData = {
          productId: productId,
          quantity: quantity,
          currency: "INR",
        };

        // Add variant information if a variant is selected
        if (selectedVariant && selectedVariant._id) {
          orderData.variantId = selectedVariant._id;
        }

        console.log("Sending order data:", orderData);

        const razorpayOrderResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create-direct-razorpay-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
          }
        );

        if (!razorpayOrderResponse.ok) {
          const errorText = await razorpayOrderResponse.text();
          console.error("Razorpay error response:", errorText);
          throw new Error(
            `Failed to create payment order: ${
              razorpayOrderResponse.statusText || errorText
            }`
          );
        }

        const razorpayOrderData = await razorpayOrderResponse.json();

        // Add debug logging
        console.log("Razorpay order data received:", razorpayOrderData);
        console.log("Order ID:", razorpayOrderData.data?.id);
        console.log("Amount:", razorpayOrderData.data?.amount);
        console.log("Currency:", razorpayOrderData.data?.currency);

        // Update totals with the server-calculated values - for display purposes
        // We don't need to update state because the Razorpay order is already created with the correct amount
        const serverCalculatedSubtotal =
          razorpayOrderData.data?.subtotal || totals.subtotal;
        const serverCalculatedTotal =
          razorpayOrderData.data?.total || totals.total;

        // Log the server-calculated values
        console.log("Server calculated values:", {
          subtotal: serverCalculatedSubtotal,
          total: serverCalculatedTotal,
        });

        // Ensure we have the Razorpay Key ID
        const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKeyId) {
          throw new Error("Razorpay key is not configured");
        }

        // Use server-calculated values for display and Razorpay
        const options = {
          key: razorpayKeyId.trim(),
          amount: razorpayOrderData.data.amount,
          currency: razorpayOrderData.data.currency,
          name: "Tajbee",
          description: "Tajbee Direct Purchase",
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
                    paymentMethod: "ONLINE",
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    deliveryType: "Normal",
                    productId: productId,
                    quantity: quantity,
                    variantId: selectedVariant?._id,
                    productDetails: {
                      name: product.name,
                      mainImage: product.mainImage,
                      variantDetails: selectedVariant
                        ? selectedVariant.attributes
                        : null,
                    },
                  }),
                }
              );

              if (orderResponse.ok) {
                const orderData = await orderResponse.json();

                // Dismiss processing toast first
                toast.dismiss(processToast);
                toast.success(
                  "Payment successful! Your order has been placed."
                );

                // Clean up buyNowData from localStorage
                if (typeof window !== "undefined") {
                  localStorage.removeItem("buyNowData");
                }

                // Small delay before redirect for better UX
                setTimeout(() => {
                  router.push(
                    `/order-confirmation?orderId=${orderData.data._id}`
                  );
                }, 1000);
              } else {
                const errorData = await orderResponse.json().catch(() => ({}));
                console.error("Order creation failed:", errorData);

                // Dismiss processing toast first
                toast.dismiss(processToast);

                // Format a user-friendly error message
                let errorMessage = "Failed to create order";
                if (errorData.message) {
                  errorMessage = errorData.message;
                } else if (orderResponse.status === 400) {
                  errorMessage =
                    "Invalid order information. Please check your details.";
                } else if (orderResponse.status === 401) {
                  errorMessage = "Please log in again to place your order.";
                } else if (orderResponse.status === 500) {
                  errorMessage = "Server error. Please try again later.";
                }

                toast.error(errorMessage);
              }
            } catch (error) {
              console.error("Payment handling error:", error);

              // Dismiss processing toast first
              toast.dismiss(processToast);

              // More specific error message
              let errorMessage = "There was an error processing your payment.";

              // Add network error detection
              if (!navigator.onLine) {
                errorMessage += " Please check your internet connection.";
              } else if (error.message) {
                errorMessage += " " + error.message;
              }

              toast.error(errorMessage);
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

              // Dismiss processing toast first if it exists
              toast.dismiss(processToast);

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

      // Dismiss the processing toast if it exists
      toast.dismiss(processToast);

      // Format a user-friendly error message
      let errorMessage = "Failed to process checkout. ";

      if (error.message) {
        errorMessage += error.message;
      }

      // Check for network-related errors
      if (!navigator.onLine) {
        errorMessage += " Please check your internet connection.";
      }

      // Show the error toast
      toast.error(errorMessage);

      // Log additional details to help debug
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      console.log("Razorpay Key ID:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
      console.log("Order data:", { product, selectedAddress, quantity });
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
        <div className="mb-6">
          <Link
            href={`/product/${productId}`}
            className="text-gray-600 hover:text-amber-600 transition-colors flex items-center gap-1 text-sm"
            onClick={() => {
              // Clean up buyNowData if user goes back to product page
              if (typeof window !== "undefined") {
                localStorage.removeItem("buyNowData");
              }
            }}
          >
            <ArrowLeft size={16} />
            Back to Product
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

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
                      className="border-gray-300"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Address
                    </Button>
                  </div>{" "}
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
                      Continue
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
                            <CreditCard className="w-4 h-4 mr-2" /> Online
                            Payment
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Credit Card, Debit Card, UPI, Net Banking & more
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            Secure payment via Tajbee Payment Gateway
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
                      Back
                    </Button>
                    <Button
                      onClick={handleDirectCheckout}
                      disabled={orderLoading}
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      {orderLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2" />
                      ) : null}
                      {orderLoading
                        ? "Processing..."
                        : `Place Order - ₹${totals.total.toLocaleString()}`}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm mt-6 sm:mt-0">
              <div className="mb-4">
                <h2 className="text-xl font-bold">Order Summary</h2>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 overflow-hidden rounded-md flex-shrink-0">
                    <img
                      src={
                        selectedVariant &&
                        selectedVariant.images &&
                        selectedVariant.images.length > 0
                          ? selectedVariant.images[0]
                          : product.mainImage
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {product.name}
                    </p>

                    {/* Display variant details if available */}
                    {selectedVariant && selectedVariant.attributes && (
                      <div className="mt-1 text-sm text-gray-500">
                        {Object.entries(selectedVariant.attributes).map(
                          ([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {value}
                            </span>
                          )
                        )}
                      </div>
                    )}

                    {/* Quantity selector */}
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() =>
                          quantity > 1 && setQuantity(quantity - 1)
                        }
                        className="p-1 border rounded-md"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="mx-3 text-sm font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          quantity < 10 && setQuantity(quantity + 1)
                        }
                        className="p-1 border rounded-md"
                        disabled={quantity >= 10}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-between mt-2">
                      <p className="text-sm text-gray-600">
                        {quantity} x ₹
                        {(selectedVariant
                          ? selectedVariant.price
                          : product.price
                        ).toLocaleString()}
                      </p>
                      <p className="font-medium text-gray-900">
                        ₹
                        {(
                          (selectedVariant
                            ? selectedVariant.price
                            : product.price) * quantity
                        ).toLocaleString()}
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
              </div>

              <div className="border-t border-b py-2 my-4">
                <div className="flex justify-between font-bold">
                  <span>Order total:</span>
                  <span>₹{totals.total.toLocaleString()}</span>
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
                    <p className="text-xs mt-1">Free delivery included</p>
                  </div>
                </div>
              )}

              {/* Variant selector - hidden but accessible for mobile devices */}
              {product && product.variants && product.variants.length > 1 && (
                <div className="mt-4 pt-4 border-t md:hidden">
                  <h3 className="font-medium text-sm mb-2">Variants:</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant._id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-2 text-sm border rounded-md flex flex-col items-center justify-center ${
                          selectedVariant && selectedVariant._id === variant._id
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-300 hover:border-amber-300"
                        }`}
                      >
                        {variant.attributes &&
                          Object.entries(variant.attributes).map(
                            ([key, value]) => (
                              <span key={key} className="text-xs">
                                {key}: {value}
                              </span>
                            )
                          )}
                        <span className="font-medium mt-1">
                          ₹{variant.price}
                        </span>
                      </button>
                    ))}
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
                    {paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
