import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./index.css";

// Import Slick slider styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeSlider = () => {
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => {
        if (data.slider) {
          setSliderImages(data.slider);
        }
      })
      .catch((err) => console.error("Error fetching slider images:", err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    adaptiveHeight: true,
    customPaging: (i) => (
      <div className="w-3 h-3 rounded-full bg-emerald-100/50 hover:bg-emerald-200 transition-colors duration-300"></div>
    ),
  };

  return (
    <div className="relative w-full overflow-hidden shadow-lg">
      <Slider {...settings}>
        {sliderImages.map((img, index) => (
          <div
            key={img._id}
            className="relative group"
            aria-hidden={index !== 0}
            tabIndex={index === 0 ? "0" : "-1"}
          >
            {/* Image with enhanced hover */}
            <div className="relative overflow-hidden">
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/${img.filename}`}
                alt="Slider"
                className="w-full h-[50vh] md:h-[80vh] object-cover transform transition-all duration-1000 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient overlay with hover enhancement */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/40 to-emerald-900/80 transition-all duration-1000 group-hover:via-emerald-900/50 group-hover:to-emerald-900/90" />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto transform transition-all duration-1000 ease-out">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 drop-shadow-2xl animate-fadeInUp px-4 font-serif">
                  <span className="text-amber-400">Bamroda Vibhag</span>
                  <br className="hidden md:block" />
                  <span className="block mt-1 md:mt-2 text-emerald-50">
                    Trivedi Mevada Brahman Samaj
                  </span>
                </h1>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 font-medium mb-4 md:mb-8 drop-shadow-md animate-fadeInUp delay-300">
                  Preserving Traditions, Building Future
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fadeInUp delay-500">
                  <button className="bg-amber-500 text-emerald-900 px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors duration-300 shadow-sm text-sm sm:text-base flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Explore Village
                  </button>
                  <button className="border-2 border-amber-500 text-amber-100 px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-amber-500/20 transition-colors duration-300 shadow-sm text-sm sm:text-base">
                    Join Community
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Custom Dots Container */}
      <style>{`
        .slick-dots {
          bottom: 20px !important;
        }
        .slick-dots li.slick-active div {
          background: #f59e0b !important;
        }
        @media (max-width: 640px) {
          .slick-dots {
            bottom: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomeSlider;
