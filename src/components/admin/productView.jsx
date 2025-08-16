// Live preview of product details
export function ProductPreview({ formData, mainImage }) {
  const {
    name,
    brand,
    price,
    mrpPrice,
    discount,
    totalStock,
    description,
    variants,
  } = formData;
  const calcDiscountPrice = () => {
    const mrp = parseFloat(mrpPrice) || 0;
    const disc = parseFloat(discount) || 0;
    const basePrice = parseFloat(price) || 0;

    if (disc > 0 && mrp > 0) {
      return (mrp - (mrp * disc) / 100).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  return (
    <div className="space-y-2">
      {/* Image */}
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded">
        {mainImage ? (
          <img
            src={URL.createObjectURL(mainImage)}
            alt="Preview"
            className="object-contain h-full"
          />
        ) : (
          <span className="text-sm text-gray-400">No image</span>
        )}
      </div>

      {/* Basic details */}
      <h3 className="text-lg font-semibold">{name || "Product Name"}</h3>
      <p className="text-sm text-gray-500">{brand || "Brand"}</p>

      {/* Pricing */}
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-green-600">
          ₹{calcDiscountPrice()}
        </span>
        {discount > 0 && (
          <>
            <span className="line-through text-sm text-gray-400">
              ₹{mrpPrice}
            </span>
            <span className="text-sm text-red-500">-{discount}%</span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-sm line-clamp-3">
        {description || "Product description will appear here."}
      </p>

      {/* Variants summary */}
      {variants?.length > 0 && (
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">{variants.length} variant(s) configured</p>
          <ul className="list-disc pl-4">
            {variants.map((variant, idx) => (
              <li key={idx}>
                {variant.name || `Variant ${idx + 1}`}:{" "}
                {Array.isArray(variant.attributes)
                  ? variant.attributes
                      .map((attr) => `${attr.key}: ${attr.value}`)
                      .join(", ")
                  : "No attributes"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
