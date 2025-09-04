"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetCart } from "@/redux/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Package, Clock, FileText, MapPin } from "lucide-react";

export default function OrderConfirmationPage() {
  const dispatch = useDispatch();

  // Generate a random order number
  const orderNumber = `AMZ-${Math.floor(Math.random() * 10000000)}`;

  // Generate estimated delivery date (5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  useEffect(() => {
    // Clear the cart when the confirmation page loads
    dispatch(resetCart());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-green-100 rounded-full p-3 mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We've received it and will begin
            processing right away.
          </p>
        </div>

        <div className="border rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Order Information</h2>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex">
              <FileText className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-500">Order Number</div>
                <div className="font-medium">{orderNumber}</div>
              </div>
            </div>

            <div className="flex">
              <Package className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-500">Shipping Method</div>
                <div className="font-medium">Standard Delivery</div>
              </div>
            </div>

            <div className="flex">
              <Clock className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-500">Estimated Delivery</div>
                <div className="font-medium">
                  {deliveryDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="flex">
              <MapPin className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-500">Shipping Address</div>
                <div className="font-medium">
                  123 Sample St, Sample City, Sample State, 12345
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            What happens next?
          </h3>
          <ol className="list-decimal ml-5 space-y-2 text-sm text-blue-800">
            <li>
              You'll receive an order confirmation email with details of your
              purchase.
            </li>
            <li>We'll notify you when your order has been shipped.</li>
            <li>Track your order status in your account dashboard.</li>
            <li>Enjoy your products!</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white w-full">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/account/orders">
            <Button variant="outline" className="w-full">
              View Your Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
