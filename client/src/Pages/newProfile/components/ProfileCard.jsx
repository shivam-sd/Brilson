import { memo, useState } from "react";
import { FaLocationDot, FaShareNodes } from "react-icons/fa6";
import { LuCheck } from "react-icons/lu";
import { BOTTOM_QUOTE, HANDWRITTEN_LINES } from "../data/profileConfig";
import ContactActions from "./ContactActions";
import SocialLinks from "./SocialLinks";
import SafeImage from "./ui/SafeImage";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

const initialsOf = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

function ProfileCard({ profile }) {
  const [shareStatus, setShareStatus] = useState("");

  const { name, tagline, location, profileImage, coverImage, verified, socialLinks, image } = profile;


  const handleShare = async () => {
    const shareData = {
      title: name,
      text: tagline ? `${name} - ${tagline}` : `Check out ${name}'s profile`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("Profile link copied!");

      setTimeout(() => {
        setShareStatus("");
      }, 2000);
    } catch (error) {
      if (error?.name === "AbortError") return;

      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("Profile link copied!");

        setTimeout(() => {
          setShareStatus("");
        }, 2000);
      } catch {
        setShareStatus("Unable to share profile");
      }
    }
  };

  return (
    <article
      aria-label={`${name}'s profile`}
      className="overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-b from-[#0a1016] to-[#03060a] shadow-[0_24px_60px_-24px_rgba(0,0,0,1)]"
    >
      <div className="relative h-[300px] sm:h-[340px]">
        <div className="absolute inset-0">
          <SafeImage
            src={coverImage}
            alt=""
            eager
            className="h-full w-full bg-[#0a1016]"
            imgClassName="object-top grayscale contrast-110"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#05090d]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent" />

        {/* handwritten flourish */}
        <div aria-hidden="true" className="pointer-events-none absolute left-4 top-14 select-none sm:left-6 sm:top-16">
          <p className="font-script -rotate-[9deg] text-[26px] leading-[1.08] text-white/95 sm:text-[31px]">
            {HANDWRITTEN_LINES.map((line, i) => (
              <span key={line} className="block" style={{ paddingLeft: `${[0, 4, 14, 0][i] ?? 0}px` }}>
                {line}
              </span>
            ))}
          </p>
          <svg className="-mt-1 h-4 w-28 text-orange-500 sm:w-32" viewBox="0 0 128 16" fill="none">
            <path d="M2 14C34 12 86 7 126 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* avatar */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-5">
          <div className="group relative">
            <div className="h-[124px] w-[124px] rounded-full border-4 border-orange-500 bg-[#05090d] p-[3px] shadow-[0_0_36px_-4px_rgba(249,115,22,0.5)] transition-transform duration-300 hover:scale-105 motion-reduce:transition-none sm:h-[134px] sm:w-[134px]">
              <SafeImage
                src={profileImage}
                alt={`Photo of ${name}`}
                eager
                className="h-full w-full rounded-full"
                imgClassName="grayscale transition-[filter] duration-500 hover:grayscale-0 motion-reduce:transition-none"
                fallback={
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-orange-500/30 to-slate-800 text-3xl font-bold text-white">
                    {initialsOf(name)}
                  </div>
                }
              />
            </div>
            {verified && (
              <span className="absolute bottom-1 right-1 grid h-[30px] w-[30px] place-items-center rounded-full border-2 border-[#05090d] bg-[#2f7cf6] text-white shadow-lg">
                <LuCheck className="h-4 w-4" strokeWidth={3.5} aria-hidden="true" />
                <span className="sr-only">Verified profile</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 pt-8 text-center sm:px-6">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-white sm:text-[32px]">{name}</h1>
        {tagline && <p className="mt-1.5 text-[15px] text-slate-200">{tagline}</p>}
        {location && (
          <p className="mt-2.5 inline-flex items-center justify-center gap-1.5 text-[15px] text-slate-200">
            <FaLocationDot className="h-4 w-4 text-orange-500" aria-hidden="true" />
            {location}
          </p>
        )}

        <div className="mt-5">
          <ContactActions profile={profile} />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleShare}
            className="group flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/60 hover:bg-white/[0.05] active:translate-y-0 motion-reduce:transition-none"
            aria-label="Share profile"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-orange-500/15 text-orange-400 transition-transform duration-300 group-hover:scale-110">
              <FaShareNodes className="h-4 w-4" aria-hidden="true" />
            </span>

            <span>{shareStatus || "Share Profile"}</span>
          </button>

          <Link
            to={profile?.reviewLink}
            target="_blank"
            className="group flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/60 hover:bg-white/[0.05] active:translate-y-0 motion-reduce:transition-none"
          >
            <FaGoogle className="h-4 w-4" aria-hidden="true" />

            <span className="decoration-white/30 underline-offset-4 group-hover:decoration-orange-400">
              Review on Google
            </span>

            <FiExternalLink
              className="h-4 w-4 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-orange-400"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="hidden md:block mt-5 border-t border-white/10 pt-5">
          <SocialLinks links={socialLinks} />
        </div>

        {/* <p className="font-script mt-5 border-t border-white/10 pt-5 text-lg italic text-slate-300 sm:text-xl">
          &ldquo;{BOTTOM_QUOTE}&rdquo;
        </p> */}
      </div>
    </article>
  );
}

export default memo(ProfileCard);
