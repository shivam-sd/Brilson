import { memo } from "react";
import { Link } from "react-router-dom";
import { SOCIAL_PLATFORMS } from "../data/profileConfig";
import { cn } from "../utils/helpers";

function SocialLinks({ links }) {
  if (!links?.length) return null;

  return (
    <div
      className="
        fixed bottom-3 left-1/2 z-50 w-[calc(100%-24px)] -translate-x-1/2
        rounded-xl border border-cyan-400/20
        bg-gradient-to-b from-[#08141d]/95 to-[#050c12]/95
        px-2 py-2
        shadow-[0_12px_35px_-15px_rgba(34,211,238,0.4)]
        backdrop-blur-md

        md:static md:w-full md:translate-x-0
        md:rounded-2xl md:px-3 md:pb-3 md:pt-4
      "
    >
      {/* Desktop only */}
      <div className="mb-3 hidden items-center justify-center md:flex">
        <h3 className="text-[15px] font-semibold tracking-wide text-white">
          Connect with me
        </h3>
      </div>

      <ul
        aria-label="Social media"
        className="
          flex justify-center gap-2 overflow-x-auto
          scrollbar-none
          md:justify-start md:gap-3
        "
      >
        {links.map(({ platform, url }) => {
          const config = SOCIAL_PLATFORMS[platform];

          if (!config || !url) return null;

          const { Icon, label, className } = config;

          return (
            <li key={platform} className="shrink-0">
              <Link
                to={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (opens in a new tab)`}
                title={label}
                className="
                  group flex h-[54px] w-[54px]
                  items-center justify-center
                  rounded-lg border border-white/10
                  bg-[#07131c]
                  transition-colors duration-200
                  hover:border-cyan-400/30
                  hover:bg-white/[0.06]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-cyan-400
                  motion-reduce:transition-none

                  md:h-[86px] md:w-[80px]
                  md:flex-col md:gap-2 md:rounded-xl md:px-2
                "
              >
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full text-white md:h-10 md:w-10",
                    className
                  )}
                >
                  <Icon
                    className="h-4 w-4 md:h-5 md:w-5"
                    aria-hidden="true"
                  />
                </span>

                {/* Mobile: label hidden */}
                <span className="hidden max-w-full truncate text-[10px] font-medium leading-none text-white/75 group-hover:text-white md:block">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default memo(SocialLinks);