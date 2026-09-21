import { memo } from "react";
import { SOCIAL_PLATFORMS } from "../data/profileConfig";
import { cn } from "../utils/helpers";

function SocialLinks({ links }) {
  if (!links?.length) return null;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-[#08141d] to-[#050c12] px-3 pb-3 pt-4 shadow-[0_12px_35px_-20px_rgba(34,211,238,0.35)]">
      <div className="mb-3 flex items-center justify-center gap-3">
        <h3 className="text-[15px] font-semibold tracking-wide text-white">
          Connect with me
        </h3>
      </div>

      <ul
        aria-label="Social media"
        className="flex gap-3 overflow-x-auto pb-1 scrollbar-none"
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
                className="group flex h-[86px] w-[80px] flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#07131c] px-2 transition-all duration-200 hover:border-cyan-400/30 hover:bg-white/[0.06]  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 motion-reduce:transition-none"
              >
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full text-white transition-transform duration-200 group-hover:scale-105",
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