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
        rounded-xl border border-white/10 bg-white/[0.03]
         

        md:static md:w-full md:translate-x-0
        md:rounded-2xl md:px-3 md:pb-3 md:pt-2
      "
    >
      <div className="mb-3 hidden items-center justify-center md:flex">
        <h3 className="text-[15px] font-semibold tracking-wide text-white">
          Connect with me
        </h3>
      </div>

      <ul
        aria-label="Social media"
        className="
          flex w-full min-w-0
          justify-start gap-1
          overflow-x-auto overflow-y-hidden
          scrollbar-none
          overscroll-x-contain
          touch-pan-x
          md:justify-start
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
                  shrink-0 items-center justify-center
                  transition-colors duration-200
                  focus-visible:outline-none
                  focus-visible:ring-2
                  motion-reduce:transition-none

                  md:h-[86px] md:w-[50px]
                  md:flex-col md:gap-2 md:rounded-xl
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

                <span className="hidden max-w-full truncate text-[9px] font-medium leading-none text-white/75 group-hover:text-white md:block">
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