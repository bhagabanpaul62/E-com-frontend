import Link from "next/link";
import Image from "next/image";

const CategoryNavigation = ({ categories, getSafeImageUrl }) => {
  return (
    <section className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
          {categories.slice(0, 10).map((category) => (
            <Link
              key={category._id}
              href={`/category/${category._id}`}
              className="group text-center hover:shadow-md transition-all duration-200 p-2 rounded-lg"
            >
              <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-200 transition-colors relative overflow-hidden">
                {getSafeImageUrl(category.image) ? (
                  <Image
                    src={getSafeImageUrl(category.image)}
                    alt={category.name || "Category"}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {category.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryNavigation;
