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
      <div className="w-full h-56 md:h-72 lg:h-96 bg-gray-200 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading banners...</p>
      </div>
    );
  }

  if (banners.length === 0) {
    return null; // Don't render anything if no banners
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner slides */}
      <div
        className="flex transition-transform duration-500 ease-out h-48 sm:h-56 md:h-72 "
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

      {/* Navigation arrows */}
      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 rounded-full p-2 shadow-md z-10 transition-all opacity-70 hover:opacity-100 hidden sm:block"
        onClick={prevSlide}
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>
      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 rounded-full p-2 shadow-md z-10 transition-all opacity-70 hover:opacity-100 hidden sm:block"
        onClick={nextSlide}
      >
        <FaChevronRight className="w-4 h-4" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              current === index ? "bg-white w-4" : "bg-white/50"
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
