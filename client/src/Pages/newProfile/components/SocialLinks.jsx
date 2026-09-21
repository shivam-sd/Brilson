import { memo, useRef } from "react";
import { SOCIAL_PLATFORMS } from "../data/profileConfig";
import { cn } from "../utils/helpers";

function SocialLinks({ links }) {
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  if (!links?.length) return null;

  const handlePointerDown = (event) => {
    const container = scrollRef.current;

    if (!container) return;

    isDragging.current = true;
    hasDragged.current = false;
    startX.current = event.clientX;
    startScrollLeft.current = container.scrollLeft;

    container.setPointerCapture?.(event.pointerId);
    container.classList.add("cursor-grabbing");
  };

  const handlePointerMove = (event) => {
    if (!isDragging.current) return;

    const container = scrollRef.current;
    const distance = event.clientX - startX.current;

    if (Math.abs(distance) > 5) {
      hasDragged.current = true;
    }

    container.scrollLeft = startScrollLeft.current - distance;
  };

  const handlePointerUp = (event) => {
    isDragging.current = false;
    scrollRef.current?.releasePointerCapture?.(event.pointerId);
    scrollRef.current?.classList.remove("cursor-grabbing");
  };

  const handleClick = (event) => {
    if (hasDragged.current) {
      event.preventDefault();
      hasDragged.current = false;
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-[#08141d] to-[#050c12] px-3 pb-3 pt-4 shadow-[0_12px_35px_-20px_rgba(34,211,238,0.35)]">
      <div className="mb-3 flex items-center justify-center">
        <h3 className="text-[15px] font-semibold tracking-wide text-white">
          Connect with me
        </h3>
      </div>

      <ul
        ref={scrollRef}
        aria-label="Social media"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex cursor-grab select-none gap-3 overflow-x-auto pb-1 scrollbar-none touch-pan-x"
      >
        {links.map(({ platform, url }) => {
          const config = SOCIAL_PLATFORMS[platform];

          if (!config || !url) return null;

          const { Icon, label, className } = config;

          return (
            <li key={platform} className="shrink-0">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (opens in a new tab)`}
                title={label}
                onClick={handleClick}
                draggable={false}
                className="group flex h-[86px] w-[80px] flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#07131c] px-2 transition-colors duration-200 hover:border-cyan-400/30 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 motion-reduce:transition-none"
              >
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full text-white",
                    className
                  )}
                >
                  {platform === "snapchat" ? (
                    <Icon
                      className="h-5 w-5"
                      aria-hidden="true"
                      stroke="black"
                      strokeWidth="1.5"
                    />
                  ) : (
                    <Icon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  )}
                </span>

                <span className="max-w-full truncate text-[10px] font-medium leading-none text-white/75 group-hover:text-white">
                  {label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default memo(SocialLinks);