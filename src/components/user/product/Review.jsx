"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Star,
  Edit3,
  Trash2,
  Flag,
  CheckCircle,
  X,
  Plus,
  Filter,
  SortDesc,
} from "lucide-react";
import ReviewNameDisplay from "./ReviewNameDisplay";

const Review = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    reviewId: null,
  });
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [filterRating, setFilterRating] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  });

  // Check if user is logged in (you'll need to implement your auth logic)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check authentication status
    checkAuthStatus();
    fetchReviews();
    fetchUserReview();
  }, [productId, currentPage, sortBy, filterRating]);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setIsLoggedIn(true);
        // Fetch user details from localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            // Ensure user has at least a name or set to anonymous
            setCurrentUser(
              userData?.name ? userData : { ...userData, name: "Anonymous" }
            );
          } catch (jsonError) {
            console.error("Error parsing user data:", jsonError);
            setCurrentUser({ name: "Anonymous" });
          }
        } else {
          setCurrentUser({ name: "Anonymous" });
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setCurrentUser({ name: "Anonymous" });
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_SERVER}/api/reviews/product/${productId}?page=${currentPage}&sort=${sortBy}`;

      if (filterRating) {
        // You'll need to implement rating filtering in the backend
        url += `&rating=${filterRating}`;
      }

      const response = await axios.get(url);

      if (response.data.success) {
        const data = response.data.data;
        setReviews(data.reviews);
        setTotalPages(data.pagination.totalPages);
        setRatingDistribution(data.ratingDistribution);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    if (!isLoggedIn) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/reviews/user/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setUserReview(response.data.data);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Error fetching user review:", error);
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showPopup("Please login to write a review", "warning");
      return;
    }

    if (formData.rating === 0) {
      showPopup("Please select a rating", "warning");
      return;
    }

    // If the user is trying to submit a new review (not editing) and they already have a review
    if (!editingReview && userReview) {
      showPopup(
        "You have already reviewed this product. You can edit your existing review instead.",
        "info"
      );
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const url = editingReview
        ? `${process.env.NEXT_PUBLIC_SERVER}/api/reviews/${editingReview._id}`
        : `${process.env.NEXT_PUBLIC_SERVER}/api/reviews/create`;

      const method = editingReview ? "patch" : "post";

      const payload = {
        ...formData,
        productId: productId,
      };

      const response = await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setFormData({ rating: 0, comment: "" });
        setShowWriteReview(false);
        setEditingReview(null);
        fetchReviews();
        fetchUserReview();
        showPopup(
          editingReview
            ? "Review updated successfully!"
            : "Review submitted successfully!",
          "success"
        );
      }
    } catch (error) {
      console.error("Error submitting review:", error);

      // Check if the error is about already reviewing the product
      if (
        error.response?.data?.message ===
        "You have already reviewed this product"
      ) {
        showPopup(
          "You have already reviewed this product. You can edit your existing review instead.",
          "info"
        );

        // Refresh user review to show the existing one
        fetchUserReview();
      } else {
        showPopup(
          error.response?.data?.message || "Error submitting review",
          "error"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      showPopup("Please login to edit your review", "warning");
      return;
    }

    // Check if this is the user's review
    if (currentUser?._id !== review.userId?._id) {
      showPopup("You can only edit your own reviews", "warning");
      return;
    }

    setFormData({
      rating: review.rating,
      comment: review.comment || "",
    });
    setEditingReview(review);
    setShowWriteReview(true);

    // Scroll to review form
    setTimeout(() => {
      document.getElementById("review-form")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleDeleteReview = async (reviewId) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      showPopup("Please login to delete your review", "warning");
      return;
    }

    // Show confirmation popup
    setDeleteConfirmation({ show: true, reviewId });
  };

  const confirmDeleteReview = async (reviewId) => {
    setDeleteConfirmation({ show: false, reviewId: null });

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER}/api/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchReviews();
      fetchUserReview();
      showPopup("Review deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting review:", error);
      showPopup("Error deleting review", "error");
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
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

  // Helper function to show popup messages
  const showPopup = (message, type = "info") => {
    setPopup({ show: true, message, type });

    // Auto-hide popup after 3 seconds for success messages
    if (type === "success") {
      setTimeout(() => {
        setPopup((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start space-x-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">
              {averageRating || "0.0"}
            </div>
            <div className="flex justify-center mt-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 w-8">{stars}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-400 h-2 rounded-full"
                    style={{
                      width: `${
                        totalReviews > 0
                          ? ((ratingDistribution[stars] || 0) / totalReviews) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {ratingDistribution[stars] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      {isLoggedIn && !userReview && (
        <button
          onClick={() => setShowWriteReview(true)}
          className="flex items-center space-x-2 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Write a Review</span>
        </button>
      )}

      {/* User's Review */}
      {userReview && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Your Review</h3>
              <div className="flex flex-col space-y-3 mt-1">
                <div className="flex items-center space-x-3">
                  {renderStars(userReview.rating)}
                  <span className="text-sm text-gray-600">
                    {formatDate(userReview.createdAt)}
                  </span>
                </div>
                <ReviewNameDisplay
                  user={currentUser}
                  isVerified={userReview.isVerifiedPurchase}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditReview(userReview)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteReview(userReview._id)}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          {userReview.comment && (
            <p className="text-gray-800">{userReview.comment}</p>
          )}
        </div>
      )}

      {/* Write/Edit Review Form */}
      {showWriteReview && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                {editingReview ? "Edit Your Review" : "Write a Review"}
              </h3>
              {editingReview && (
                <p className="text-sm text-gray-500 mt-1">
                  You are editing your review posted on{" "}
                  {formatDate(editingReview.createdAt)}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setShowWriteReview(false);
                setEditingReview(null);
                setFormData({ rating: 0, comment: "" });
              }}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            id="review-form"
            onSubmit={handleSubmitReview}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex space-x-1">
                {renderStars(formData.rating, true, (rating) =>
                  setFormData({ ...formData, rating })
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review (Optional)
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Share your experience with this product..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting || formData.rating === 0}
                className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {submitting
                  ? "Submitting..."
                  : editingReview
                  ? "Update Review"
                  : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowWriteReview(false);
                  setEditingReview(null);
                  setFormData({ rating: 0, comment: "" });
                }}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <select
              value={filterRating || ""}
              onChange={(e) => setFilterRating(e.target.value || null)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <SortDesc className="h-4 w-4 text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="createdAt">Most Recent</option>
              <option value="rating">Highest Rated</option>
              <option value="-rating">Lowest Rated</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {reviews.length} of {totalReviews} reviews
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border-b border-gray-200 pb-6 last:border-b-0"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center space-x-2">
                  <ReviewNameDisplay
                    user={review.userId}
                    isVerified={review.isVerifiedPurchase}
                  />
                  {review.isVerifiedPurchase && (
                    <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex">
                {/* Show edit and delete buttons for user's own review */}
                {currentUser &&
                  review.userId &&
                  currentUser._id === review.userId._id && (
                    <>
                      <button
                        onClick={() => handleEditReview(review)}
                        className="p-2 mr-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit your review"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="p-2 mr-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete your review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                {/* Report button for other users' reviews */}
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>

            {review.comment && (
              <p className="text-gray-800 mb-4">{review.comment}</p>
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
                <p className="text-gray-700">{review.adminReply.message}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
          ))}

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {!isLoggedIn && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Sign in to write a review</p>
          <Link
            href="/login"
            className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Custom Popup Message */}
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 backdrop-blur-sm">
          <div
            className={`max-w-md w-full bg-white rounded-lg shadow-lg p-6 transform transition-all 
            ${
              popup.type === "success"
                ? "border-l-4 border-green-500"
                : popup.type === "error"
                ? "border-l-4 border-red-500"
                : popup.type === "warning"
                ? "border-l-4 border-yellow-500"
                : ""
            }
          `}
          >
            <div className="flex justify-between items-start">
              <h3
                className={`text-lg font-medium 
                ${
                  popup.type === "success"
                    ? "text-green-600"
                    : popup.type === "error"
                    ? "text-red-600"
                    : popup.type === "warning"
                    ? "text-yellow-600"
                    : "text-gray-900"
                }
              `}
              >
                {popup.type === "success"
                  ? "Success"
                  : popup.type === "error"
                  ? "Error"
                  : popup.type === "warning"
                  ? "Warning"
                  : "Notification"}
              </h3>
              <button
                onClick={() => setPopup({ ...popup, show: false })}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-700">{popup.message}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setPopup({ ...popup, show: false })}
                className={`px-4 py-2 rounded-md text-white 
                  ${
                    popup.type === "success"
                      ? "bg-green-600 hover:bg-green-700"
                      : popup.type === "error"
                      ? "bg-red-600 hover:bg-red-700"
                      : popup.type === "warning"
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                `}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-30 backdrop-blur-sm">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-red-600">
                Confirm Deletion
              </h3>
              <button
                onClick={() =>
                  setDeleteConfirmation({ show: false, reviewId: null })
                }
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this review? This action cannot
                be undone.
              </p>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() =>
                  setDeleteConfirmation({ show: false, reviewId: null })
                }
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteReview(deleteConfirmation.reviewId)}
                className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
