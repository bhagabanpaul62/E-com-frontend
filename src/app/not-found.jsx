import { AlertTriangle } from "lucide-react"; // Optional, for icon (if using Lucide)
import "./globals.css";
export default function notFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-yellow-500 w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          Oops! We can’t find the page you’re looking for. It might have been
          moved or deleted.
        </p>

        <a
          href="/"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-6 py-3 rounded-full transition duration-200"
        >
          Go Back Home
        </a>

        <div className="mt-4 text-sm text-gray-500">
          Need help?{" "}
          <a href="/contact" className="text-blue-600 hover:underline">
            Contact support
          </a>
        </div>
      </div>
    </div>
  );
}
