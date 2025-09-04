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
  Gift,
} from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, totalItems, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");

  // Dates for delivery estimate
  const standardDelivery = new Date();
  standardDelivery.setDate(standardDelivery.getDate() + 5);

  const expressDelivery = new Date();
  expressDelivery.setDate(expressDelivery.getDate() + 2);

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const calculateTotal = () => {
    let total = totalPrice;

    // Add shipping cost
    if (deliveryOption === "express") {
      total += 9.99;
    } else if (deliveryOption === "standard" && totalPrice < 35) {
      total += 5.99;
    }

    // Add tax (estimated as 8.25%)
    const tax = totalPrice * 0.0825;
    total += tax;

    return {
      subtotal: totalPrice,
      shipping:
        deliveryOption === "express" ? 9.99 : totalPrice < 35 ? 5.99 : 0,
      tax: tax,
      total: total,
    };
  };

  const totals = calculateTotal();

  const handleContinueToPayment = () => {
    // Validate address form
    setStep(2);
  };

  const handlePlaceOrder = () => {
    // Process payment and place order
    // For demo purposes, redirect to confirmation page
    router.push("/order-confirmation");
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-amber-500 text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <div
            className={`h-1 w-12 ${step >= 2 ? "bg-amber-500" : "bg-gray-200"}`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? "bg-amber-500 text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <div
            className={`h-1 w-12 ${step >= 3 ? "bg-amber-500" : "bg-gray-200"}`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? "bg-amber-500 text-white" : "bg-gray-200"
            }`}
          >
            3
          </div>
        </div>
      </div>
    );
  };

  const renderShippingForm = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={shippingAddress.fullName}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  fullName: e.target.value,
                })
              }
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Address Line 1
            </label>
            <input
              type="text"
              value={shippingAddress.addressLine1}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  addressLine1: e.target.value,
                })
              }
              className="w-full p-2 border rounded-md"
              placeholder="Street address, P.O. box, company name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              value={shippingAddress.addressLine2}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  addressLine2: e.target.value,
                })
              }
              className="w-full p-2 border rounded-md"
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                value={shippingAddress.state}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    state: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code</label>
              <input
                type="text"
                value={shippingAddress.zipCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    zipCode: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <select
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>
        </form>

        <h3 className="font-medium text-lg mt-8 mb-4">Delivery Options</h3>

        <div className="space-y-3 mb-6">
          <div
            className={`border rounded-md p-3 cursor-pointer ${
              deliveryOption === "standard"
                ? "border-amber-500 bg-amber-50"
                : ""
            }`}
            onClick={() => setDeliveryOption("standard")}
          >
            <div className="flex">
              <input
                type="radio"
                checked={deliveryOption === "standard"}
                onChange={() => {}}
                className="mr-2 mt-0.5 accent-amber-500"
              />
              <div>
                <p className="font-medium">Standard Delivery</p>
                <p className="text-xs text-gray-500">
                  {standardDelivery.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-700">
                  {totalPrice >= 35 ? "FREE" : "$5.99"}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`border rounded-md p-3 cursor-pointer ${
              deliveryOption === "express" ? "border-amber-500 bg-amber-50" : ""
            }`}
            onClick={() => setDeliveryOption("express")}
          >
            <div className="flex">
              <input
                type="radio"
                checked={deliveryOption === "express"}
                onChange={() => {}}
                className="mr-2 mt-0.5 accent-amber-500"
              />
              <div>
                <p className="font-medium">Express Delivery</p>
                <p className="text-xs text-gray-500">
                  {expressDelivery.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-700">$9.99</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-lg mb-3">Gift Options</h3>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="gift-option"
              checked={isGift}
              onChange={() => setIsGift(!isGift)}
              className="mr-2 accent-amber-500"
            />
            <label htmlFor="gift-option" className="text-sm">
              This order contains a gift
            </label>
          </div>

          {isGift && (
            <textarea
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Add a gift message here..."
              rows={3}
            />
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Link href="/cart">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Cart
            </Button>
          </Link>

          <Button
            onClick={handleContinueToPayment}
            className="bg-amber-500 hover:bg-amber-600 text-white"
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
            className={`border rounded-md p-4 cursor-pointer ${
              paymentMethod === "card" ? "border-amber-500 bg-amber-50" : ""
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                checked={paymentMethod === "card"}
                onChange={() => {}}
                className="mr-2 accent-amber-500"
              />
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                <span>Credit/Debit Card</span>
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="mt-4 pl-6">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className={`border rounded-md p-4 cursor-pointer ${
              paymentMethod === "paypal" ? "border-amber-500 bg-amber-50" : ""
            }`}
            onClick={() => setPaymentMethod("paypal")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                checked={paymentMethod === "paypal"}
                onChange={() => {}}
                className="mr-2 accent-amber-500"
              />
              <span className="font-bold text-blue-800">PayPal</span>
            </div>
          </div>

          <div
            className={`border rounded-md p-4 cursor-pointer ${
              paymentMethod === "cod" ? "border-amber-500 bg-amber-50" : ""
            }`}
            onClick={() => setPaymentMethod("cod")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => {}}
                className="mr-2 accent-amber-500"
              />
              <span>Cash on Delivery</span>
            </div>
            {paymentMethod === "cod" && (
              <p className="text-xs text-gray-500 mt-2 pl-6">
                Pay with cash upon delivery. Additional fee may apply.
              </p>
            )}
          </div>
        </div>

        <div className="border-t pt-4 mt-6">
          <div className="flex items-center text-sm mb-4">
            <Lock className="w-4 h-4 mr-2 text-gray-600" />
            <span>
              Your payment information is encrypted for your protection
            </span>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Shipping
            </Button>

            <Button
              onClick={handlePlaceOrder}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderOrderSummary = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        <div className="space-y-4 max-h-60 overflow-auto mb-4">
          {items.map((item) => (
            <div
              key={`${item.product._id}-${item.variantId || "default"}`}
              className="flex"
            >
              <div className="w-16 h-16 bg-gray-100 relative rounded overflow-hidden flex-shrink-0">
                {item.product.mainImage ? (
                  <Image
                    src={item.product.mainImage}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="ml-3 flex-grow">
                <h3 className="text-sm font-medium line-clamp-2">
                  {item.product.name}
                </h3>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </span>
                  <span className="text-sm font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm border-t pt-4">
          <div className="flex justify-between">
            <span>Items ({totalItems}):</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping & handling:</span>
            <span>
              {totals.shipping > 0 ? `$${totals.shipping.toFixed(2)}` : "FREE"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Estimated tax:</span>
            <span>${totals.tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-b py-2 my-4">
          <div className="flex justify-between font-bold">
            <span>Order total:</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
        </div>

        {step === 1 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 flex items-start">
            <Truck className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <p>
              {deliveryOption === "standard"
                ? `Estimated delivery: ${standardDelivery.toLocaleDateString(
                    "en-US",
                    { weekday: "long", month: "short", day: "numeric" }
                  )}`
                : `Express delivery: ${expressDelivery.toLocaleDateString(
                    "en-US",
                    { weekday: "long", month: "short", day: "numeric" }
                  )}`}
            </p>
          </div>
        )}

        {isGift && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100 text-sm text-green-800 flex items-start">
            <Gift className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <p>This order includes a gift message</p>
          </div>
        )}
      </div>
    );
  };

  // Create a dummy order confirmation page for now
  if (!user || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>

      {renderStepIndicator()}

      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          {step === 1 && renderShippingForm()}
          {step === 2 && renderPaymentForm()}
        </div>

        <div className="lg:col-span-1">{renderOrderSummary()}</div>
      </div>
    </div>
  );
}
