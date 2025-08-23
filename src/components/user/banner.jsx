import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Banner() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    getBanner();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    let interval;
    if (!isPaused && banners.length > 0) {
      interval = setInterval(() => {
        nextSlide();
      }, 4000); // Slide every 4 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, banners.length, current]);

  // Control functions
  const nextSlide = useCallback(() => {
    setCurrent((current) => (current + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrent((current) => (current === 0 ? banners.length - 1 : current - 1));
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left (next)
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right (prev)
      prevSlide();
    }
  };

  async function getBanner() {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/users/banners`
      );
      setBanners(res.data.data.homePageBanner || []);
      console.log("banner data", res.data.data.homePageBanner);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full h-32 sm:h-40 md:h-56 lg:h-64 xl:h-80 bg-gray-200 animate-pulse flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base">Loading banners...</p>
      </div>
    );
  }

  if (banners.length === 0) {
    return null; // Don't render anything if no banners
  }

  return (
    <div
      className="relative w-full overflow-hidden bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner slides */}
      <div
        className="flex transition-transform duration-500 ease-out h-32 sm:h-40 md:h-56 lg:h-64 xl:h-80"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="min-w-full h-full">
            <img
              src={banner}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows - Hidden on mobile */}
      <button
        className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1.5 sm:p-2 shadow-lg z-10 transition-all opacity-0 sm:opacity-70 hover:opacity-100 hidden sm:block"
        onClick={prevSlide}
        aria-label="Previous banner"
      >
        <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      <button
        className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1.5 sm:p-2 shadow-lg z-10 transition-all opacity-0 sm:opacity-70 hover:opacity-100 hidden sm:block"
        onClick={nextSlide}
        aria-label="Next banner"
      >
        <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 flex justify-center gap-1 sm:gap-1.5">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
              current === index
                ? "bg-white w-3 sm:w-4"
                : "bg-white/60 hover:bg-white/80"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Banner;

// You can also add this CSS to your global stylesheet if preferred
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .carousel-fade {
    animation: fadeIn 0.5s ease-out;
  }
  
  @media (max-width: 640px) {
    .carousel-dots {
      bottom: 0.5rem;
    }
    
    .carousel-dot {
      width: 6px;
      height: 6px;
    }
  }
`;
