"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";

export default function CartQuantity({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = "default",
}) {
  const handleDecrease = () => {
    if (quantity > min) {
      onDecrease();
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onIncrease();
    }
  };

  const sizeClasses = {
    small: {
      container: "h-7",
      button: "w-6 h-7",
      icon: "w-3 h-3",
      text: "text-xs w-6",
    },
    default: {
      container: "h-10",
      button: "w-8 h-10",
      icon: "w-4 h-4",
      text: "text-sm w-8",
    },
    large: {
      container: "h-12",
      button: "w-10 h-12",
      icon: "w-5 h-5",
      text: "text-base w-10",
    },
  };

  const classes = sizeClasses[size] || sizeClasses.default;

  return (
    <div
      className={`inline-flex items-center border rounded-md ${classes.container}`}
    >
      <button
        onClick={handleDecrease}
        disabled={quantity <= min}
        className={`${
          classes.button
        } flex items-center justify-center border-r ${
          quantity <= min
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        aria-label="Decrease quantity"
      >
        <Minus className={classes.icon} />
      </button>

      <span
        className={`${classes.text} flex items-center justify-center font-medium`}
      >
        {quantity}
      </span>

      <button
        onClick={handleIncrease}
        disabled={quantity >= max}
        className={`${
          classes.button
        } flex items-center justify-center border-l ${
          quantity >= max
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        aria-label="Increase quantity"
      >
        <Plus className={classes.icon} />
      </button>
    </div>
  );
}
