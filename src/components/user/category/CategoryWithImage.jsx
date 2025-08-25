// Moved from user/categoryWithImage.jsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

function CategoryWithImage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const GetCategory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/users/category`
      );
      const parentCategories = res.data.data.data.filter(
        (cat) => cat.parentId === null && cat.image && cat.isFeatured
      );
      setCategories(parentCategories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetCategory();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
        <Link
          href="/categories"
          className="text-amber-600 hover:text-amber-700 text-sm font-medium"
        >
          View All
        </Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 overflow-x-auto hide-scrollbar pb-2 snap-x">
          {[...Array(8)].map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 overflow-x-auto hide-scrollbar pb-2 snap-x ">
          {categories.map((category) => (
            <CatCard
              key={category._id}
              img={category.image}
              title={category.name}
              slug={category.slug}
              id={category._id}
            />
          ))}
          {categories.length < 8 && (
            <Link href="/categories">
              <div className="flex flex-col items-center justify-center h-full transition-transform hover:translate-y-[-5px] cursor-pointer group">
                <div className="w-full aspect-square overflow-hidden rounded-full border-2 border-gray-100 shadow-sm bg-white p-2 mb-3 group-hover:border-amber-200 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-center text-amber-600 group-hover:text-amber-800 transition-colors px-1">
                  View All
                </h3>
              </div>
            </Link>
          )}
        </div>
      )}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default CategoryWithImage;

function CatCard({ img, title, slug, id }) {
  return (
    <Link href={`/category/${slug || id}`}>
      <div className="flex flex-col items-center transition-transform  cursor-pointer group ">
        <div className="w-full aspect-square overflow-hidden rounded-full border-2 border-gray-100 shadow-sm bg-white p-2 mb-3 group-hover:border-amber-200">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-50">
            <img
              src={img || "/placeholder-category.svg"}
              alt={title}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-category.svg";
              }}
            />
          </div>
        </div>
        <h3 className="text-sm font-medium text-center text-gray-800 group-hover:text-amber-600 transition-colors px-1">
          {title}
        </h3>
      </div>
    </Link>
  );
}

function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full aspect-square rounded-full bg-gray-200 animate-pulse mb-3"></div>
      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
    </div>
  );
}
