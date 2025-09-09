"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function TestRazorpay() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [corsTestResult, setCorsTestResult] = useState("");
  const [configTestResult, setConfigTestResult] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    // Get access token on component mount
    const token = localStorage.getItem("accessToken");
    setAccessToken(token || "Not found");
  }, []);

  const testRazorpayConfig = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/debug/razorpay-config`
      );

      const data = await response.json();
      setConfigTestResult(
        `Status: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`
      );
    } catch (error) {
      setConfigTestResult(`Error: ${error.message}`);
    }
  };

  const testCorsEndpoint = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/debug/cors-test`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = await response.json();
      setCorsTestResult(
        `Status: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`
      );
    } catch (error) {
      setCorsTestResult(`Error: ${error.message}`);
    }
  };

  const testRazorpayOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setResult("No access token found. Please log in first.");
        return;
      }

      // Log environment variables
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      console.log("Razorpay Key ID:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

      // Test the API endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create-razorpay-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: 500,
            currency: "INR",
          }),
        }
      );

      const responseText = await response.text();
      let jsonResult;
      try {
        jsonResult = JSON.parse(responseText);
      } catch (e) {
        jsonResult = { error: "Invalid JSON response", raw: responseText };
      }

      setResult(
        `Status: ${response.status} ${
          response.statusText
        }\nHeaders: ${JSON.stringify(
          Object.fromEntries(response.headers.entries())
        )}\nResponse: ${JSON.stringify(jsonResult, null, 2)}`
      );
    } catch (error) {
      console.error("Test failed:", error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Test Razorpay Integration</h1>

      <div className="mb-4">
        <p className="text-sm mb-2">
          <strong>Access Token Status:</strong>{" "}
          {accessToken ? "Present" : "Missing"}
        </p>
        <p className="text-sm mb-2">
          <strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}
        </p>
        <p className="text-sm mb-4">
          <strong>Razorpay Key ID:</strong>{" "}
          {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          onClick={testCorsEndpoint}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Test CORS Connection
        </Button>

        <Button
          onClick={testRazorpayConfig}
          className="bg-green-500 hover:bg-green-600"
        >
          Test Razorpay Config
        </Button>

        <Button
          onClick={testRazorpayOrder}
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600"
        >
          {loading ? "Testing..." : "Test Razorpay Order Creation"}
        </Button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">CORS Test Result:</h2>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap overflow-auto max-h-40">
          {corsTestResult || "No result yet. Click the button to test."}
        </pre>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Razorpay Config Test:</h2>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap overflow-auto max-h-40">
          {configTestResult || "No result yet. Click the button to test."}
        </pre>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Razorpay Test Result:</h2>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap overflow-auto max-h-96">
          {result || "No result yet. Click the button to test."}
        </pre>
      </div>
    </div>
  );
}
