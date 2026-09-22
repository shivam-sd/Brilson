import { useMemo } from "react";
import { useGetCard, useGetLocation, useGetProfileLogo } from "../api/profileApi";
import AccordionList from "../components/AccordionList";
import ProfileCard from "../components/ProfileCard";
import ProfileCardSkeleton from "../components/ProfileCardSkeleton";
import { normalizeProfile } from "../utils/profileAdapter";
import "../styles/profile.css";
import { useParams } from "react-router-dom";
import SocialLinks from "../components/SocialLinks";

function ProfileError({ onRetry, canRetry }) {
  return (
    <div role="alert" className="rounded-[22px] border border-white/10 bg-[#0a1016] px-6 py-14 text-center">
      <p className="text-lg font-semibold text-white">This profile couldn&apos;t be loaded</p>
      <p className="mt-2 text-sm text-slate-400">Check the link and your connection, then try again.</p>
      {canRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1016]"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { slug: code } = useParams()
  const cardQuery = useGetCard(code);
  const logoQuery = useGetProfileLogo(code);
  const googleReviewData = useGetLocation(code);

  const loading = cardQuery.isLoading || logoQuery.isLoading;
  const profile = useMemo(
    () => normalizeProfile(cardQuery.data, logoQuery.data?.profileLogo, googleReviewData?.data?.data?.googleReviewLink),
    [cardQuery.data, logoQuery.data?.profileLogo, googleReviewData?.data?.data?.googleReviewLink]
  );

  return (
    <div className="profile-page profile-bg min-h-screen text-slate-100 antialiased">
      <main
        className={[
          "mx-auto grid w-full max-w-[640px] grid-cols-1 gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-8",
          "lg:max-w-[1180px] lg:grid-cols-[minmax(340px,37%)_minmax(0,1fr)] lg:items-start lg:gap-6 lg:px-8",
          "min-[1440px]:max-w-[1320px]",
        ].join(" ")}
      >
        <div className="lg:top-6 lg:[@media(min-height:760px)]:sticky">
          {loading ? (
            <ProfileCardSkeleton />
          ) : profile ? (
            <ProfileCard profile={profile} code={code} />
          ) : (
            <ProfileError canRetry={cardQuery.isError} onRetry={() => cardQuery.refetch()} />
          )}
        </div>

        <div className="mb-7">
          <AccordionList code={code} profile={profile} />

          <div className="mt-5 border-t border-white/10 pt-5 sm:hidden">
            <SocialLinks links={profile?.socialLinks} />
          </div>
        </div>
      </main>
    </div>
  );
}
