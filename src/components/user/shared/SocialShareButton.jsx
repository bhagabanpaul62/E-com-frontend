"use client";

import { Share2, Copy, Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SocialShareButton({
  title = "Check this out!",
  text = "I found something interesting!",
  url,
  size = "default",
  variant = "outline",
  iconOnly = false,
  className = "",
  platforms = ["copy", "facebook", "twitter", "linkedin", "email"],
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Get the URL to share
  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  // Handle native sharing (for mobile devices)
  const handleNativeShare = () => {
    try {
      if (navigator.share) {
        navigator
          .share({
            title,
            text,
            url: shareUrl,
          })
          .then(() => toast.success("Shared successfully"))
          .catch((error) => {
            console.error("Error sharing:", error);
            setIsOpen(true); // Fall back to dropdown if native share fails
          });
      } else {
        setIsOpen(true); // Open dropdown for platforms without Web Share API
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Couldn't share content");
    }
  };

  // Handle specific platform shares
  const handlePlatformShare = (platform) => {
    let shareLink = "";

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "email":
        shareLink = `mailto:?subject=${encodeURIComponent(
          title
        )}&body=${encodeURIComponent(`${text} ${shareUrl}`)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
        setIsOpen(false);
        return;
      default:
        return;
    }

    // Open share link in new window
    window.open(shareLink, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (isOpen && !e.target.closest(".share-dropdown")) {
      setIsOpen(false);
    }
  };

  // Add event listener when dropdown is open
  if (typeof window !== "undefined" && isOpen) {
    document.addEventListener("click", handleClickOutside);
  }

  return (
    <div className={`relative inline-block share-dropdown ${className}`}>
      {/* Main share button */}
      <Button
        onClick={handleNativeShare}
        variant={variant}
        size={size}
        className={`${iconOnly ? "px-2" : ""} ${className}`}
        title="Share"
      >
        <Share2 className={`${iconOnly ? "mr-0" : "mr-2"} h-4 w-4`} />
        {!iconOnly && "Share"}
      </Button>

      {/* Dropdown for share options */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 p-1 border">
          <div className="py-1">
            {platforms.includes("copy") && (
              <button
                onClick={() => handlePlatformShare("copy")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </button>
            )}
            {platforms.includes("facebook") && (
              <button
                onClick={() => handlePlatformShare("facebook")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </button>
            )}
            {platforms.includes("twitter") && (
              <button
                onClick={() => handlePlatformShare("twitter")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </button>
            )}
            {platforms.includes("linkedin") && (
              <button
                onClick={() => handlePlatformShare("linkedin")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </button>
            )}
            {platforms.includes("email") && (
              <button
                onClick={() => handlePlatformShare("email")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
