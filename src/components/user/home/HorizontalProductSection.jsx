import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import ProductCard from "./ProductCard";

const HorizontalProductSection = ({
  title,
  products,
  categoryLink = "#",
  getSafeImageUrl,
  pricePrefix = "From ₹",
  subtitle = "⭐ 4.3 | 2,34,567 ratings",
}) => {
  return (
    <section className="bg-white mt-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <Link
            href={categoryLink}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
          >
            VIEW ALL <FaArrowRight className="text-xs" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-4 p-4 min-w-max">
            {products.slice(0, 16).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                getSafeImageUrl={getSafeImageUrl}
                pricePrefix={pricePrefix}
                subtitle={subtitle}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HorizontalProductSection;
