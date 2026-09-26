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
  const realSlides = images.length ? images : activeImage ? [activeImage] : [];
  const hasMultiple = realSlides.length > 1;

  const slides = hasMultiple
    ? [realSlides[realSlides.length - 1], ...realSlides, realSlides[0]]
    : realSlides;

  const startExtIndex = hasMultiple ? 1 : 0;

  const scrollRef = useRef(null);
  const slideWidthRef = useRef(0);

  const isJumping = useRef(false);
  const scrollTimeout = useRef(null);
  const autoplayInterval = useRef(null);
  const resizeFrame = useRef(null);

  const [extIndex, setExtIndex] = useState(() =>
    hasMultiple
      ? Math.max(0, realSlides.indexOf(activeImage)) + 1
      : 0
  );

  const realIndex = hasMultiple
    ? (extIndex - 1 + realSlides.length) % realSlides.length
    : 0;

  /*
   * Cache slide width.
   * clientWidth is read only when the size actually needs updating,
   * instead of repeatedly reading it during scrolling.
   */
  const updateSlideWidth = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;

    const width = el.clientWidth;

    if (width > 0) {
      slideWidthRef.current = width;
    }

    return width;
  }, []);

  const scrollToExt = useCallback(
    (index, smooth = true) => {
      const el = scrollRef.current;
      if (!el) return;

      let width = slideWidthRef.current;

      if (!width) {
        width = updateSlideWidth();
      }

      if (!width) return;

      el.scrollTo({
        left: index * width,
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [updateSlideWidth]
  );

  /*
   * Initial position.
   */
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      updateSlideWidth();
      scrollToExt(startExtIndex, false);
    });

    return () => cancelAnimationFrame(frame);
  }, [startExtIndex, updateSlideWidth, scrollToExt]);

  /*
   * Optimized resize handling.
   * requestAnimationFrame prevents repeated layout work during resize.
   */
  useEffect(() => {
    const handleResize = () => {
      if (resizeFrame.current) {
        cancelAnimationFrame(resizeFrame.current);
      }

      resizeFrame.current = requestAnimationFrame(() => {
        updateSlideWidth();
        scrollToExt(extIndex, false);
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);

      if (resizeFrame.current) {
        cancelAnimationFrame(resizeFrame.current);
      }
    };
  }, [extIndex, updateSlideWidth, scrollToExt]);

  /*
   * Scroll handling.
   * Uses cached width instead of reading clientWidth on every scroll.
   */
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;

    if (!el || isJumping.current) return;

    clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      const currentEl = scrollRef.current;

      if (!currentEl) return;

      const width = slideWidthRef.current;

      if (!width) return;

      const newExtIndex = Math.round(
        currentEl.scrollLeft / width
      );

      if (hasMultiple && newExtIndex === 0) {
        isJumping.current = true;

        setExtIndex(realSlides.length);

        scrollToExt(realSlides.length, false);

        requestAnimationFrame(() => {
          isJumping.current = false;
        });

        return;
      }

      if (
        hasMultiple &&
        newExtIndex === slides.length - 1
      ) {
        isJumping.current = true;

        setExtIndex(1);

        scrollToExt(1, false);

        requestAnimationFrame(() => {
          isJumping.current = false;
        });

        return;
      }

      if (newExtIndex !== extIndex) {
        setExtIndex(newExtIndex);
      }
    }, 120);
  }, [
    hasMultiple,
    realSlides.length,
    slides.length,
    extIndex,
    scrollToExt,
  ]);

  /*
   * Keep active image synchronized.
   */
  useEffect(() => {
    if (!realSlides.length) return;

    const idx = hasMultiple
      ? (extIndex - 1 + realSlides.length) % realSlides.length
      : 0;

    const img = realSlides[idx];

    if (img && img !== activeImage) {
      setActiveImage(img);
    }
  }, [
    extIndex,
    hasMultiple,
    realSlides,
    activeImage,
    setActiveImage,
  ]);

  /*
   * Go directly to a real slide.
   */
  const goToReal = useCallback(
    (index) => {
      const target = hasMultiple ? index + 1 : index;

      setExtIndex(target);
      scrollToExt(target, true);
    },
    [hasMultiple, scrollToExt]
  );

  /*
   * Move to next slide.
   */
  const goNext = useCallback(() => {
    const el = scrollRef.current;

    if (!el) return;

    const width = slideWidthRef.current;

    if (!width) return;

    const currentIndex = Math.round(
      el.scrollLeft / width
    );

    const next = currentIndex + 1;

    scrollToExt(next, true);
  }, [scrollToExt]);

  /*
   * Start autoplay.
   */
  const startAutoplay = useCallback(() => {
    if (!hasMultiple) return;

    clearInterval(autoplayInterval.current);

    autoplayInterval.current = setInterval(
      goNext,
      3000
    );
  }, [hasMultiple, goNext]);

  /*
   * Stop autoplay.
   */
  const stopAutoplay = useCallback(() => {
    clearInterval(autoplayInterval.current);
    autoplayInterval.current = null;
  }, []);

  /*
   * Autoplay lifecycle.
   */
  useEffect(() => {
    startAutoplay();

    return () => {
      stopAutoplay();
    };
  }, [startAutoplay, stopAutoplay]);

  /*
   * Cleanup scroll timeout.
   */
  useEffect(() => {
    return () => {
      clearTimeout(scrollTimeout.current);
    };
  }, []);

  if (!realSlides.length) {
    return null;
  }

  return (
    <div className="relative bg-gray-900/40 p-3 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl">
      {discount && (
        <span
          className="
            absolute
            top-2 sm:top-4 md:top-6
            left-2 sm:left-4 md:left-6
            bg-red-500
            px-2 sm:px-3
            py-0.5 sm:py-1
            rounded-full
            text-[10px] sm:text-xs md:text-sm
            font-bold
            z-10
            font-Roboto
          "
        >
          {discount}% OFF
        </span>
      )}

      <div
        className="
          relative
          aspect-square
          w-full
          bg-gradient-to-br
          from-gray-800/30
          to-gray-900/30
          rounded-lg
          sm:rounded-xl
          overflow-hidden
        "
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
      >
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={stopAutoplay}
          onTouchEnd={startAutoplay}
          className="
            flex
            w-full
            h-full
            overflow-x-auto
            snap-x
            snap-mandatory
            scroll-smooth
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {slides.map((img, index) => (
            <div
              key={`${img}-${index}`}
              className="
                flex-shrink-0
                w-full
                h-full
                snap-center
                flex
                items-center
                justify-center
              "
            >
              <img
                src={img}
                alt={`${alt} ${index + 1}`}
                width={800}
                height={800}
                loading={index === startExtIndex ? "eager" : "lazy"}
                decoding="async"
                className="
                  w-full
                  h-full
                  object-contain
                  cursor-pointer
                  p-2 sm:p-3
                "
                onClick={onZoomClick}
                onError={(e) => {
                  const imgElement = e.currentTarget;

                  if (!imgElement.dataset.fallback) {
                    imgElement.dataset.fallback = "true";
                    imgElement.src = "/images/no-image.webp";
                  }
                }}
              />
            </div>
          ))}
        </div>

        {hasMultiple && (
          <div
            className="
              absolute
              bottom-2 sm:bottom-3
              left-1/2
              -translate-x-1/2
              flex
              items-center
              gap-1.5 sm:gap-2
              z-10
            "
          >
            {realSlides.map((_, index) => {
              const distance = Math.abs(
                index - realIndex
              );

              const isActive = index === realIndex;

              const scale =
                distance === 0
                  ? "w-4 sm:w-5"
                  : distance === 1
                    ? "w-1.5 sm:w-2"
                    : "w-1 sm:w-1.5";

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToReal(index)}
                  aria-label={`Go to image ${index + 1}`}
                  aria-current={
                    isActive ? "true" : undefined
                  }
                  className={`
                    h-1.5 sm:h-2
                    rounded-full
                    transition-[width]
                    duration-200
                    cursor-pointer
                    ${scale}
                    ${
                      isActive
                        ? "bg-cyan-400"
                        : "bg-white/40"
                    }
                  `}
                />
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={onZoomClick}
          aria-label="Zoom product image"
          className="
            absolute
            bottom-2 sm:bottom-3
            right-2 sm:right-3
            bg-black/50
            p-1.5 sm:p-2
            rounded-full
            hover:bg-black/70
            transition-colors
            cursor-pointer
            z-10
          "
        >
          <FiZoomIn
            className="text-white"
            size={16}
          />
        </button>
      </div>
    </div>
  );
}
