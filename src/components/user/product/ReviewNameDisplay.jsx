"use client";
import React from "react";
import { User } from "lucide-react";

// Component to display reviewer name in a professional format
const ReviewNameDisplay = ({ user, isVerified }) => {
  // Always display the component, even if user is missing
  // This ensures Anonymous is shown instead of nothing
  const displayName = user?.name || "Anonymous";

  return (
    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
        <User className="h-4 w-4" />
      </div>
      <div>
        <p className="font-medium text-sm text-blue-800">{displayName}</p>
        {isVerified && (
          <p className="text-xs text-blue-500">Verified Purchaser</p>
        )}
      </div>
    </div>
  );
};

export default ReviewNameDisplay;
