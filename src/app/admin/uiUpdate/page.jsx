"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MdDelete, MdFileUpload, MdImage } from "react-icons/md";

export default function UiUpdate() {
  // State for banners
  const [bannerImages, setBannerImages] = useState([]);
  const [selectedBannerImages, setSelectedBannerImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingBanners, setExistingBanners] = useState([]);

  // Fetch existing banners on page load
  useEffect(() => {
    fetchBanners();
  }, []);

  // Function to fetch existing banners
  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/admin/banners`,
        {
          withCredentials: true,
        }
      );
      if (response.data?.data?.homePageBanner) {
        setExistingBanners(response.data.data.homePageBanner);
      }
    } catch (error) {
      toast.error("Error fetching banners");
      console.error("Error fetching banners:", error);
    }
  };

  // Handle file selection for banners
  const handleBannerSelect = (e) => {
    const files = Array.from(e.target.files);
    setBannerImages(files);

    // Create preview URLs for selected images
    const imagePreviewUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedBannerImages(imagePreviewUrls);
  };

  // Handle banner upload
  const handleBannerUpload = async () => {
    if (bannerImages.length === 0) {
      toast.error("Please select at least one banner image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      bannerImages.forEach((image) => {
        formData.append("banner", image);
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/admin/banners/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials:true
        }
      );

      if (response.status === 200) {
        toast.success("Banners uploaded successfully!");
        // Reset states
        setBannerImages([]);
        setSelectedBannerImages([]);
        // Refresh banners list
        fetchBanners();
      }
    } catch (error) {
      toast.error("Failed to upload banners");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle banner deletion
  const handleDeleteBanner = async (bannerUrl) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER}/admin/banners/delete`,
        { data: { bannerUrl } }
      );

      if (response.status === 200) {
        toast.success("Banner deleted successfully");
        // Remove the deleted banner from the state
        setExistingBanners((prevBanners) =>
          prevBanners.filter((banner) => banner !== bannerUrl)
        );
      }
    } catch (error) {
      toast.error("Failed to delete banner");
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">UI Management</h1>

      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="banners">Homepage Banners</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="space-y-6">
          {/* Banner Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Upload New Banners</h2>
            <p className="text-gray-500 text-sm mb-4">
              Upload new banners for the homepage slider. Recommended size:
              1600x400px.
            </p>

            {/* File Input */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label
                  htmlFor="banner-upload"
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <MdFileUpload className="text-lg" />
                  Select Banner Images
                </label>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleBannerSelect}
                  className="hidden"
                />

                <Button
                  onClick={handleBannerUpload}
                  disabled={bannerImages.length === 0 || loading}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {loading ? "Uploading..." : "Upload Banners"}
                </Button>
              </div>

              {/* Preview Selected Images */}
              {selectedBannerImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">
                    Selected Images ({selectedBannerImages.length})
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {selectedBannerImages.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-[16/5] rounded-md overflow-hidden border border-gray-200"
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Current Banners Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Current Banners</h2>

            {existingBanners.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-gray-500">
                <MdImage className="text-4xl mb-2" />
                <p>No banners uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {existingBanners.map((banner, index) => (
                  <div
                    key={index}
                    className="relative group aspect-[16/5] rounded-md overflow-hidden border border-gray-200"
                  >
                    <img
                      src={banner}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteBanner(banner)}
                      disabled={loading}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1.5 rounded-full text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete banner"
                    >
                      <MdDelete className="text-lg" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="logo"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold mb-4">Logo Management</h2>
          <p className="text-gray-500">Logo management coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
