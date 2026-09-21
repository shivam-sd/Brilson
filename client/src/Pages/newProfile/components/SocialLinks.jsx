import { memo } from "react";
import { SOCIAL_PLATFORMS } from "../data/profileConfig";
import { cn } from "../utils/helpers";

function SocialLinks({ links }) {
  if (!links?.length) return null;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <ul
        aria-label="Social media"
        className="flex w-full gap-2.5 overflow-x-auto pb-1 scrollbar-none"
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
                className="
                  group
                  flex
                  min-h-[58px]
                  w-[72px]
                  flex-col
                  items-center
                  justify-center
                  gap-1.5
                  rounded-lg
                  border
                  border-white/10
                  bg-[#071018]
                  px-1.5
                  py-2
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-orange-400/40
                  hover:bg-white/[0.06]
                  hover:shadow-[0_8px_25px_-12px_rgba(255,165,0,0.5)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-orange-400
                  motion-reduce:transition-none
                "
              >
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full text-white",
                    className
                  )}
                >
                  {platform === "snapchat" ? (
                    <Icon
                      className="h-[15px] w-[15px]"
                      aria-hidden="true"
                      stroke="black"
                      strokeWidth="1.5"
                    />
                  ) : (
                    <Icon
                      className="h-[15px] w-[15px]"
                      aria-hidden="true"
                    />
                  )}
                </span>

                <span className="max-w-full truncate text-[9px] font-medium leading-none text-white/65 group-hover:text-white">
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