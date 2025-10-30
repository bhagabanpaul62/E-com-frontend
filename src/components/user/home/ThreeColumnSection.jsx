import Link from "next/link";
import Image from "next/image";

const ProductColumn = ({
  title,
  products,
  getSafeImageUrl,
  theme = "discount",
}) => {
  const getThemeConfig = () => {
    switch (theme) {
      case "quality":
        return {
          tagText: "⭐ Assured",
          tagColor: "text-orange-600",
        };
      case "home":
        return {
          tagText: "Free Delivery",
          tagColor: "text-blue-600",
        };
      default:
        return {
          tagText: "Min. 30% Off",
          tagColor: "text-green-600",
        };
    }
  };

  const config = getThemeConfig();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-4 space-y-4">
        {products.slice(0, 3).map((product) => {
          const productPrice =
            product.price || product.variants?.[0]?.price || "N/A";
          const productImage =
            product.images?.[0] || product.variants?.[0]?.images?.[0];

          return (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-16 h-16 bg-gray-50 rounded flex items-center justify-center flex-shrink-0">
                {getSafeImageUrl(productImage) ? (
                  <Image
                    src={getSafeImageUrl(productImage)}
                    alt={product.name || "Product"}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <span className="text-gray-400">📦</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                  {product.name}
                </h4>
                <p className={`font-semibold text-sm ${config.tagColor}`}>
                  {config.tagText}
                </p>
                <p className="text-xs text-gray-500">₹{productPrice}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const ThreeColumnSection = ({ products, getSafeImageUrl }) => {
  return (
    <section className="mt-3 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ProductColumn
            title="Discounts for you"
            products={products.slice(0, 3)}
            getSafeImageUrl={getSafeImageUrl}
            theme="discount"
          />
          <ProductColumn
            title="Best quality"
            products={products.slice(3, 6)}
            getSafeImageUrl={getSafeImageUrl}
            theme="quality"
          />
          <ProductColumn
            title="Make your home stylish"
            products={products.slice(6, 9)}
            getSafeImageUrl={getSafeImageUrl}
            theme="home"
          />
        </div>
      </div>
    </section>
  );
};

export default ThreeColumnSection;
