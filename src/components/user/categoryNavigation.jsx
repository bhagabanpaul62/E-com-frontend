"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

function CategoryNavigation() {
  const [category, setCategory] = useState([]);
  const [menu, setMenu] = useState(false);
  const [hoveredCategoryId, setHoveredCategory] = useState("");

  const GetCategory = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER}/users/category`
    );
    setCategory(res.data.data.data || []);
  };

  useEffect(() => {
    GetCategory();
  }, []);

  // Build Recursive Tree
  function buildCategoryTree(categories, parentId = null) {
    return categories
      .filter((cat) => {
        if (!cat.parentId && parentId === null) return true;
        if (cat.parentId && parentId !== null) {
          return cat.parentId.toString() === parentId.toString();
        }
        return false;
      })
      .map((cat) => ({
        ...cat,
        Children: buildCategoryTree(categories, cat._id),
      }));
  }

  const categoryTree = buildCategoryTree(category);

  // Recursive Menu Renderer
  const renderMenu = (cats) => {
    return (
      <ul className="bg-white flex justify-center items-center gap-6 rounded-md h-10 px-4 w-full">
        {cats.map((cat) => (
          <li
            key={cat._id}
            className="relative group cursor-pointer h-full"
            onMouseEnter={() => {
              setMenu(true);
              setHoveredCategory(cat._id);
            }}
            onMouseLeave={() => {
              setMenu(false);
              setHoveredCategory("");
            }}
          >
            <div className="flex h-full  items-center gap-1 px-2 py-1 rounded-md hover:bg-amber-50 transition-all duration-200">
              <span className="font-medium text-gray-800 group-hover:text-amber-600 transition-colors duration-200">
                {cat.name}
              </span>
              {cat.Children.length > 0 && (
                <FaChevronDown className="text-xs text-gray-400 group-hover:text-amber-600 transition-transform duration-200 group-hover:rotate-180 ml-1" />
              )}
            </div>
            {cat.Children.length > 0 &&
              menu &&
              hoveredCategoryId === cat._id && (
                <div className="absolute left-100 transform -translate-x-1/2 top-9 mt-1 bg-white shadow border   py-4 px-6 min-w-[400px] max-w-[80vw] z-50 grid grid-cols-2 gap-y-3 gap-x-5 animate-fadeIn">
                  {/* Main category submenu */}
                  {cat.Children.map((sub) => (
                    <div key={sub._id} className="space-y-2">
                      <div className="flex items-center justify-between w-full">
                        <span
                          className="font-semibold text-gray-800 hover:text-amber-600 cursor-pointer transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] block"
                          title={sub.name}
                          data-tooltip={sub.name}
                        >
                          {sub.name}
                        </span>
                      </div>

                      {/* Level 2 subcategories */}
                      {sub.Children?.length > 0 && (
                        <div className="pl-3 border-l border-gray-100 space-y-1.5 mt-1">
                          {sub.Children.map((sub2) => (
                            <div key={sub2._id} className="group/sub">
                              <div className="flex items-center justify-between w-full">
                                <span
                                  className="text-sm text-gray-700 hover:text-amber-600 cursor-pointer transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] block"
                                  title={sub2.name}
                                  data-tooltip={sub2.name}
                                >
                                  {sub2.name}
                                </span>
                              </div>

                              {/* Level 3 subcategories */}
                              {sub2.Children?.length > 0 && (
                                <div className="pl-2 border-l border-gray-100 space-y-1 mt-1">
                                  {sub2.Children.map((sub3) => (
                                    <div key={sub3._id}>
                                      <span
                                        className="text-xs text-gray-600 hover:text-amber-600 cursor-pointer transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-[110px] block"
                                        title={sub3.name}
                                        data-tooltip={sub3.name}
                                      >
                                        {sub3.name}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">{renderMenu(categoryTree)}</div>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out forwards;
        }

        /* Prevent text breaking and add tooltips */
        .text-ellipsis:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          left: 0;
          top: 100%;
          z-index: 60;
          white-space: nowrap;
          background: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          display: none;
        }

        /* Show tooltip on long text hover */
        .text-ellipsis[data-tooltip]:hover::after {
          display: block;
        }
      `}</style>
    </nav>
  );
}

export default CategoryNavigation;
