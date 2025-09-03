"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Star,
  MessageCircle,
  CheckCircle,
  Clock,
  User,
  Package,
  Send,
  X,
} from "lucide-react";

const AdminReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyingToReview, setReplyingToReview] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, replied

  useEffect(() => {
    fetchReviews();
  }, [currentPage, filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      let url = `${process.env.NEXT_PUBLIC_SERVER}/api/admin/reviews?page=${currentPage}`;

      if (filter === "pending") {
        url += "&status=pending";
      } else if (filter === "replied") {
        url += "&status=replied";
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const data = response.data.data;
        setReviews(data.reviews);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (reviewId) => {
    if (!replyMessage.trim()) {
      alert("Please enter a reply message");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/reviews/admin/reply/${reviewId}`,
        { message: replyMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setReplyingToReview(null);
        setReplyMessage("");
        fetchReviews();
        alert("Reply sent successfully!");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Error sending reply");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-amber-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Review Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === "pending"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pending Reply
          </button>
          <button
            onClick={() => setFilter("replied")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === "replied"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Replied
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-base">
                      {review.userId?.firstName} {review.userId?.lastName || ""}
                    </span>
                    {review.isVerifiedPurchase && (
                      <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {review.adminReply ? (
                      <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Replied
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending Reply
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {review.productId?.name}
                  </span>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600">
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                {review.comment && (
                  <p className="text-gray-800 mb-4">{review.comment}</p>
                )}

                {review.adminReply && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-blue-900">
                        Your Reply
                      </span>
                      <span className="text-xs text-blue-600">
                        {formatDate(review.adminReply.repliedAt)}
                      </span>
                    </div>
                    <p className="text-blue-800">{review.adminReply.message}</p>
                  </div>
                )}

                {!review.adminReply && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setReplyingToReview(review._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      Reply to Review
                    </button>
                  </div>
                )}
              </div>
            </div>

            {replyingToReview === review._id && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">
                    Reply to Customer
                  </h4>
                  <button
                    onClick={() => {
                      setReplyingToReview(null);
                      setReplyMessage("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your response to this review..."
                />
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => handleReplySubmit(review._id)}
                    disabled={submitting || !replyMessage.trim()}
                    className="flex items-center space-x-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submitting ? "Sending..." : "Send Reply"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setReplyingToReview(null);
                      setReplyMessage("");
                    }}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reviews found
          </h3>
          <p className="text-gray-600">
            {filter === "pending"
              ? "All reviews have been replied to."
              : filter === "replied"
              ? "No replied reviews found."
              : "No reviews have been submitted yet."}
          </p>
        </div>
      )}

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
                  ? "bg-blue-500 text-white border-blue-500"
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
    </div>
  );
};

export default AdminReviewManagement;
