import { useState, useRef, useEffect, useCallback } from "react";
import { FiZoomIn } from "react-icons/fi";

export default function ImageCarousel({
  images = [],
  activeImage,
  setActiveImage,
  discount,
  onZoomClick,
  alt = "Product image",
}) {
  const realSlides = images.length ? images : [activeImage];
  const hasMultiple = realSlides.length > 1;

  const slides = hasMultiple
    ? [realSlides[realSlides.length - 1], ...realSlides, realSlides[0]]
    : realSlides;

  const startExtIndex = hasMultiple ? 1 : 0;

  const scrollRef = useRef(null);
  const isJumping = useRef(false);
  const scrollTimeout = useRef(null);
  const autoplayInterval = useRef(null);

  const [extIndex, setExtIndex] = useState(
    hasMultiple ? Math.max(0, realSlides.indexOf(activeImage)) + 1 : 0
  );
  const realIndex = hasMultiple
    ? (extIndex - 1 + realSlides.length) % realSlides.length
    : 0;

  const scrollToExt = useCallback((index, smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      left: index * el.clientWidth,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    scrollToExt(startExtIndex, false);
  }, []);

  useEffect(() => {
    const handleResize = () => scrollToExt(extIndex, false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [extIndex, scrollToExt]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || isJumping.current) return;

    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const el2 = scrollRef.current;
      if (!el2) return;
      const newExtIndex = Math.round(el2.scrollLeft / el2.clientWidth);

      if (hasMultiple && newExtIndex === 0) {
        isJumping.current = true;
        setExtIndex(realSlides.length);
        scrollToExt(realSlides.length, false);
        requestAnimationFrame(() => (isJumping.current = false));
      } else if (hasMultiple && newExtIndex === slides.length - 1) {
        isJumping.current = true;
        setExtIndex(1);
        scrollToExt(1, false);
        requestAnimationFrame(() => (isJumping.current = false));
      } else {
        setExtIndex(newExtIndex);
      }
    }, 120);
  };

  useEffect(() => {
    const idx = hasMultiple
      ? (extIndex - 1 + realSlides.length) % realSlides.length
      : 0;
    const img = images[idx];
    if (img) setActiveImage(img);
  }, [extIndex]);

  const goToReal = (index) => {
    const target = hasMultiple ? index + 1 : index;
    setExtIndex(target);
    scrollToExt(target, true);
  };

  const goNext = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth) + 1;
    scrollToExt(next, true);
  }, [scrollToExt]);

  useEffect(() => {
    if (!hasMultiple) return;
    autoplayInterval.current = setInterval(goNext, 3000);
    return () => clearInterval(autoplayInterval.current);
  }, [hasMultiple, goNext]);

  const pauseAutoplay = () => clearInterval(autoplayInterval.current);
  const resumeAutoplay = () => {
    if (!hasMultiple) return;
    clearInterval(autoplayInterval.current);
    autoplayInterval.current = setInterval(goNext, 3000);
  };

  return (
    <div className="relative bg-gray-900/40 p-3 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl">
      {discount && (
        <span className="absolute top-2 sm:top-4 md:top-6 left-2 sm:left-4 md:left-6 bg-red-500 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-bold z-10 font-Roboto">
          {discount}% OFF
        </span>
      )}

      <div
        className="relative aspect-square w-full bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg sm:rounded-xl overflow-hidden"
        onMouseEnter={pauseAutoplay}
        onMouseLeave={resumeAutoplay}
      >
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={pauseAutoplay}
          onTouchEnd={resumeAutoplay}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((img, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center"
            >
              <img
                src={img}
                alt={`${alt} ${index + 1}`}
                className="w-full h-full object-contain cursor-pointer p-2 sm:p-3"
                onClick={onZoomClick}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/500x500?text=No+Image";
                }}
              />
            </div>
          ))}
        </div>

        {hasMultiple && (
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-10">
            {realSlides.map((_, index) => {
              const distance = Math.abs(index - realIndex);
              const isActive = index === realIndex;
              const scale =
                distance === 0 ? "w-4 sm:w-5" : distance === 1 ? "w-1.5 sm:w-2" : "w-1 sm:w-1.5";
              return (
                <button
                  key={index}
                  onClick={() => goToReal(index)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-200 cursor-pointer ${scale} ${
                    isActive ? "bg-cyan-400" : "bg-white/40"
                  }`}
                />
              );
            })}
          </div>
        )}

        <button
          onClick={onZoomClick}
          className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/50 p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors cursor-pointer z-10"
        >
          <FiZoomIn className="text-white" size={16} />
        </button>
      </div>
    </div>
  );
}