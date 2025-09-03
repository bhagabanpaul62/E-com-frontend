"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Star,
  Edit3,
  Trash2,
  Calendar,
  Package,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingReview, setEditingReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Form state for editing
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  });

  useEffect(() => {
    // Get current user info from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    fetchUserReviews();
  }, [currentPage]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/reviews/user?page=${currentPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setReviews(data.reviews);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setFormData({
      rating: review.rating,
      comment: review.comment || "",
    });
    setEditingReview(review);
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/reviews/${editingReview._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setEditingReview(null);
        setFormData({ rating: 0, comment: "" });
        fetchUserReviews();
        alert("Review updated successfully!");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Error updating review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER}/api/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchUserReviews();
      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error deleting review");
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-amber-400 fill-current" : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:text-amber-400" : ""}`}
        onClick={() => interactive && onStarClick && onStarClick(i + 1)}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentUser
                    ? `${currentUser.firstName || ""} ${
                        currentUser.lastName || ""
                      }`.trim()
                      ? `${currentUser.firstName || ""} ${
                          currentUser.lastName || ""
                        }`.trim() + "'s Reviews"
                      : "My Reviews"
                    : "My Reviews"}
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage all your product reviews in one place
                </p>
              </div>
              {currentUser && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Logged in as</p>
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser.firstName || ""} {currentUser.lastName || ""}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start reviewing products you've purchased to help other
                  customers.
                </p>
                <Link
                  href="/"
                  className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    {editingReview && editingReview._id === review._id ? (
                      // Edit Form
                      <form onSubmit={handleUpdateReview} className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Edit Review</h3>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingReview(null);
                              setFormData({ rating: 0, comment: "" });
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <AlertCircle className="h-5 w-5" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                          </label>
                          <div className="flex space-x-1">
                            {renderStars(formData.rating, true, (rating) =>
                              setFormData({ ...formData, rating })
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Review
                          </label>
                          <textarea
                            value={formData.comment}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                comment: e.target.value,
                              })
                            }
                            rows={4}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Update your review..."
                          />
                        </div>

                        <div className="flex space-x-3">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 disabled:bg-gray-300 transition-colors"
                          >
                            {submitting ? "Updating..." : "Update Review"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingReview(null);
                              setFormData({ rating: 0, comment: "" });
                            }}
                            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      // Review Display
                      <>
                        <div className="flex items-start space-x-4">
                          {review.productId?.mainImage && (
                            <img
                              src={review.productId.mainImage}
                              alt={review.productId.name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            />
                          )}
                          <div className="flex-1">
                            <div className="border-b border-dashed border-gray-200 pb-1 mb-2">
                              <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                My Review
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <Link
                                href={`/product/${review.productId?._id}`}
                                className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors"
                              >
                                {review.productId?.name}
                              </Link>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditReview(review)}
                                  className="flex items-center px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                                  title="Edit Review"
                                >
                                  <Edit3 className="h-4 w-4 mr-1" />
                                  <span className="text-sm">Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  className="flex items-center px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                  title="Delete Review"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  <span className="text-sm">Delete</span>
                                </button>
                              </div>
                            </div>

                            <div className="mt-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-base font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                  {review.userId
                                    ? `${review.userId.firstName || ""} ${
                                        review.userId.lastName || ""
                                      }`.trim() || "You"
                                    : currentUser
                                    ? `${currentUser.firstName || ""} ${
                                        currentUser.lastName || ""
                                      }`.trim() || "You"
                                    : "You"}
                                  <span className="text-xs text-gray-600 ml-1">
                                    (Author)
                                  </span>
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-600">
                                  {formatDate(review.createdAt)}
                                </span>
                                {review.isVerifiedPurchase && (
                                  <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                            </div>

                            {review.productId?.price && (
                              <div className="text-sm text-gray-600 mt-1">
                                Price: ₹
                                {review.productId.price.toLocaleString()}
                              </div>
                            )}

                            {review.comment && (
                              <p className="text-gray-800 mt-3">
                                {review.comment}
                              </p>
                            )}

                            {review.adminReply && (
                              <div className="bg-gray-50 border-l-4 border-amber-400 p-4 mt-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-medium text-gray-900">
                                    Store Response
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {formatDate(review.adminReply.repliedAt)}
                                  </span>
                                </div>
                                <p className="text-gray-700">
                                  {review.adminReply.message}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 border rounded-md ${
                            currentPage === page
                              ? "bg-amber-500 text-white border-amber-500"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReviews;
