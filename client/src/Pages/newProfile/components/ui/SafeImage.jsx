import { useEffect, useRef, useState } from "react";
import { LuImage } from "react-icons/lu";
import { cn } from "../../utils/helpers";

export default function SafeImage({
  src,
  alt = "",
  className,
  imgClassName,
  fallback,
  eager = false,
  loading = false,
  fit = "cover",
}) {
  const [status, setStatus] = useState(src ? "loading" : "error");
  const imgRef = useRef(null);

  useEffect(() => {
    setStatus(src ? "loading" : "error");
    const el = imgRef.current;

    if (src && el?.complete && el.naturalWidth > 0) {
      setStatus("loaded");
    }
  }, [src]);

  const showShimmer = loading || status === "loading";

  return (
    <div className={cn("relative overflow-hidden bg-white/[0.04]", className)}>
      {showShimmer && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-white/10 motion-reduce:animate-none"
        />
      )}

      {status === "error" || !src ? (
        !loading &&
        (fallback ?? (
          <div className="grid h-full w-full place-items-center text-slate-600">
            <LuImage className="h-8 w-8" aria-hidden="true" />
          </div>
        ))
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn(
            "w-full transition-opacity duration-500 motion-reduce:transition-none",
            fit === "cover" && "h-full object-cover",
            fit === "contain" && "h-auto object-contain",
            status === "loaded" ? "opacity-100" : "opacity-0",
            imgClassName
          )}
        />
      )}
    </div>
  );
}