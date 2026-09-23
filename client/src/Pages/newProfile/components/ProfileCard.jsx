import { memo, useState } from "react";
import { FaLocationDot, FaShareNodes } from "react-icons/fa6";
import { LuCheck, LuPencil } from "react-icons/lu";
import { BOTTOM_QUOTE, HANDWRITTEN_LINES } from "../data/profileConfig";
import ContactActions from "./ContactActions";
import SocialLinks from "./SocialLinks";
import SafeImage from "./ui/SafeImage";
import { Link } from "react-router-dom";
import { FaCamera, FaGoogle, FaStar } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/slices/authSlice";

const initialsOf = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

function ProfileCard({ profile, code }) {
  const [shareStatus, setShareStatus] = useState("");
  const currentUserId = useSelector(selectUser)
  const isOwner = currentUserId?._id === profile?.profileId

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
      <div className="relative h-[150px] sm:h-[340px]">
        {isOwner && (
          <Link
            to={`/profile/edit/${code}`}
            aria-label="Edit profile"
            className="absolute right-4 top-4 z-30 inline-flex items-center gap-2 rounded-lg border border-orange-400/40 bg-[#05090d]/85 px-3 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-orange-400 hover:bg-orange-500/10 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 motion-reduce:transition-none sm:right-5 sm:top-5"
          >
            <LuPencil className="h-4 w-4" aria-hidden="true" />
            <span>Edit</span>
          </Link>
        )}

        {/* Cover */}
        <div className="absolute inset-0">
          <SafeImage
            src={coverImage}
            alt=""
            eager
            className="lg:h-full h-full w-full bg-[#0a1016]"
            imgClassName="none"
          />
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#05090d]"
        />

        {/* <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent"
        /> */}

        {/* Handwritten flourish */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-14 select-none sm:left-6 sm:top-16"
        >
          {/* <p className="font-script -rotate-[9deg] text-[26px] leading-[1.08] text-white/95 sm:text-[31px]">
            {HANDWRITTEN_LINES.map((line, i) => (
              <span
                key={line}
                className="block"
                style={{
                  paddingLeft: `${[0, 4, 14, 0][i] ?? 0}px`,
                }}
              >
                {line}
              </span>
            ))}
          </p> */}
        </div>

        {/*MOBILE AVATAR \*/}
        <div className="absolute bottom-0 left-4 right-4 z-50 flex items-center gap-3 translate-y-1/2 md:hidden">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="
        h-[96px] w-[96px]
        min-[380px]:h-[104px] min-[380px]:w-[104px]
        min-[430px]:h-[112px] min-[430px]:w-[112px]
        rounded-full
        border-4 border-orange-500
        bg-[#05090d]
        p-[3px]
        shadow-[0_0_36px_-4px_rgba(249,115,22,0.5)]
      "
            >
              <SafeImage
                src={profileImage}
                alt={`Photo of ${name}`}
                eager
                className="h-full w-full rounded-full"
                // imgClassName="object-cover grayscale"
                imgClassName="object-cover"
                fallback={
                  <div className="grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-orange-500/30 to-slate-800 text-2xl font-bold text-white">
                    {initialsOf(name)}
                  </div>
                }
              />
            </div>

            {/* Camera button */}
            {/* {isOwner && (
      <Link
        to={`/profile/edit/${code}`}
        aria-label="Change profile photo"
        className="absolute bottom-0 right-[-4px] grid h-10 w-10 place-items-center rounded-full border-2 border-[#05090d] bg-[#30343a] text-white shadow-lg"
      >
        <FaCamera className="h-4 w-4" />
      </Link>
    )} */}

            {/* Verified */}
            {/* {verified && (
      <span className="absolute bottom-1 right-1 grid h-[27px] w-[27px] translate-x-1/2 place-items-center rounded-full border-2 border-[#05090d] bg-[#2f7cf6] text-white shadow-lg">
        <LuCheck
          className="h-3.5 w-3.5"
          strokeWidth={3.5}
          aria-hidden="true"
        />
        <span className="sr-only">Verified profile</span>
      </span>
    )} */}
          </div>

          <div className="min-w-0 flex-1 pt-5">
            <h2
              className="
        truncate
        text-left
        text-[14px]
        font-bold
        leading-tight
        tracking-tight
        text-white
        min-[380px]:text-[15px]
        min-[430px]:text-[16px]
      "
            >
              {name}
            </h2>

            {tagline && (
              <p className="mt-1 truncate text-left text-[12px] font-medium leading-tight text-white/75 min-[380px]:text-[13px]">
                {tagline}
              </p>
            )}
          </div>

          {/* {location && (
            <span className="max-w-[80px] shrink-0 truncate self-center text-right text-[11px] font-medium text-white/75">
              {location}
            </span>
          )} */}
        </div>

        {/* =========================================================
      DESKTOP AVATAR
      ========================================================= */}
        <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 translate-y-5 md:block">
          <div className="group relative">
            <div className="h-[124px] w-[124px] rounded-full border-4 border-orange-500 bg-[#05090d] p-[3px] shadow-[0_0_36px_-4px_rgba(249,115,22,0.5)] transition-transform duration-300 hover:scale-105 motion-reduce:transition-none sm:h-[134px] sm:w-[134px]">
              <SafeImage
                src={profileImage}
                alt={`Photo of ${name}`}
                eager
                className="h-full w-full rounded-full"
                imgClassName="transition-[filter] duration-500 motion-reduce:transition-none"
                fallback={
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-orange-500/30 to-slate-800 text-3xl font-bold text-white">
                    {initialsOf(name)}
                  </div>
                }
              />
            </div>

            {/* {verified && (
              <span className="absolute bottom-1 right-1 grid h-[30px] w-[30px] place-items-center rounded-full border-2 border-[#05090d] bg-[#2f7cf6] text-white shadow-lg">
                <LuCheck
                  className="h-4 w-4"
                  strokeWidth={3.5}
                  aria-hidden="true"
                />
                <span className="sr-only">Verified profile</span>
              </span>
            )} */}
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 pt-2 sm:pt-6 text-center sm:px-6">
        <h2 className="hidden md:block ml-10 sm:ml-0 text-[15px] font-bold leading-tight tracking-tight text-white sm:text-[25px]">
          {name}
        </h2>
        {/* {tagline && <p className="mt-1.5 text-[15px] text-slate-200">{tagline}</p>}
        {location && (
          <p className="mt-2.5 inline-flex items-center justify-center gap-1.5 text-[15px] text-slate-200">
            <FaLocationDot className="h-4 w-4 text-orange-500" aria-hidden="true" />
            {location}
          </p>
        )} */}

        <div className="md:mt-2 mt-14">
          <ContactActions profile={profile} />
        </div>
        <div className={`md:mt-5 mt-2 grid ${profile?.reviewLink ? 'grid-cols-2' : 'grid-cols-1'} gap-2.5 sm:grid-cols-2`}>
          {profile?.reviewLink &&
            <Link
              to={profile?.reviewLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Review on Google"
              className="group flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/60 hover:bg-white/[0.05] active:translate-y-0 motion-reduce:transition-none"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center">
                <FcGoogle
                  className="h-9 w-9 transition-transform duration-300 group-hover:scale-105"
                  aria-hidden="true"
                />
              </span>

              <span className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-semibold text-white">
                  Google Review
                </span>

                <span className="mt-1.5 flex items-center gap-0.5 text-[#fbbc04]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="h-3 w-3" aria-hidden="true" />
                  ))}
                </span>
              </span>
            </Link>}
          <button
            type="button"
            onClick={handleShare}
            className="cursor-pointer group flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/60 hover:bg-white/[0.05] active:translate-y-0 motion-reduce:transition-none"
            aria-label="Share profile"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-orange-500/15 text-orange-400 transition-transform duration-300 group-hover:scale-110">
              <FaShareNodes className="h-4 w-4" aria-hidden="true" />
            </span>

            <span>{shareStatus || "Share Profile"}</span>
          </button>
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
