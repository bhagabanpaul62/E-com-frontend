/**
 * Cart utility functions
 */

/**
 * Calculate total price of items in cart
 * @param {Array} items - Array of cart items
 * @returns {number} - Total price
 */
export const calculateCartTotal = (items) => {
  if (!items || !Array.isArray(items)) return 0;

  return items.reduce((total, item) => {
    const price = item.product?.price || 0;
    const quantity = item.quantity || 0;
    return total + price * quantity;
  }, 0);
};

/**
 * Calculate total number of items in cart
 * @param {Array} items - Array of cart items
 * @returns {number} - Total items count
 */
export const calculateCartItemCount = (items) => {
  if (!items || !Array.isArray(items)) return 0;

  return items.reduce((total, item) => {
    return total + (item.quantity || 0);
  }, 0);
};

/**
 * Format price as currency string
 * @param {number} price - Price in cents or dollars
 * @param {boolean} inCents - Whether price is in cents
 * @returns {string} - Formatted price
 */
export const formatPrice = (price, inCents = false) => {
  if (price === undefined || price === null) return "$0.00";

  const amount = inCents ? price / 100 : price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Check if product is in cart
 * @param {Array} items - Array of cart items
 * @param {string} productId - Product ID to check
 * @param {string} variantId - Optional variant ID to check
 * @returns {boolean} - True if product is in cart
 */
export const isProductInCart = (items, productId, variantId = null) => {
  if (!items || !Array.isArray(items) || !productId) return false;

  return items.some((item) => {
    if (item.product._id !== productId) return false;
    if (variantId) return item.variantId === variantId;
    return !item.variantId;
  });
};

/**
 * Get cart item by product ID and variant ID
 * @param {Array} items - Array of cart items
 * @param {string} productId - Product ID to find
 * @param {string} variantId - Optional variant ID to find
 * @returns {Object|null} - Cart item or null if not found
 */
export const getCartItem = (items, productId, variantId = null) => {
  if (!items || !Array.isArray(items) || !productId) return null;

  return (
    items.find((item) => {
      if (item.product._id !== productId) return false;
      if (variantId) return item.variantId === variantId;
      return !item.variantId;
    }) || null
  );
};
