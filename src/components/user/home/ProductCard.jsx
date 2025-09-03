import Link from "next/link";
import Image from "next/image";

const ProductCard = ({
  product,
  getSafeImageUrl,
  pricePrefix = "₹",
  subtitle = "⭐ 4.3 | 2,34,567 ratings",
  showDiscount = false,
  className = "w-48 flex-shrink-0",
}) => {
  const productPrice = product.price || product.variants?.[0]?.price || "N/A";
  const productImage =
    product.images?.[0] || product.variants?.[0]?.images?.[0];

  return (
    <Link
      href={`/product/${product._id}`}
      className={`${className} text-center group cursor-pointer`}
    >
      <div className="bg-gray-50 rounded-lg p-4 mb-3 group-hover:shadow-md transition-shadow relative">
        {showDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold z-10">
            -50%
          </div>
        )}
        {getSafeImageUrl(productImage) ? (
          <Image
            src={getSafeImageUrl(productImage)}
            alt={product.name || "Product"}
            width={160}
            height={160}
            className="w-full h-32 object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400 text-2xl">📦</span>
          </div>
        )}
      </div>
      <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
        {product.name}
      </h3>
      <p className="text-green-600 font-semibold">
        {pricePrefix}
        {productPrice}
      </p>
      <p className="text-gray-500 text-xs">{subtitle}</p>
    </Link>
  );
};

export default ProductCard;
