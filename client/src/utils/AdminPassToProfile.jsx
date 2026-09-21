import React, { useEffect, useState } from "react";
import { FiCopy, FiEye, FiEdit2, FiCheck, FiPlus } from "react-icons/fi";
import { MdOutlineReviews } from "react-icons/md";
import { FaTags, FaIdCard } from "react-icons/fa";
import { Wallet, Gift } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import ReferralDashboard from "./ReferralDashboard";
import {
  useGetBalance,
  useGetUserCards,
  useGetUserGoogleReviews,
  useGetUserParkingTags,
} from "../api/client-query";

/* ------------------------------------------------------------------ */
/*  Design tokens (static class names so Tailwind never purges them)   */
/* ------------------------------------------------------------------ */
const ACCENTS = {
  indigo: {
    tint: "bg-indigo-500/10 text-indigo-400",
    solid: "bg-indigo-500 hover:bg-indigo-400 text-white",
    soft: "bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20",
  },
  emerald: {
    tint: "bg-emerald-500/10 text-emerald-400",
    solid: "bg-emerald-500 hover:bg-emerald-400 text-white",
    soft: "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
  },
  rose: {
    tint: "bg-rose-500/10 text-rose-400",
    solid: "bg-rose-500 hover:bg-rose-400 text-white",
    soft: "bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
  },
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */
const StatusPill = ({ active }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
      active ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-amber-400"}`}
    />
    {active ? "Active" : "Inactive"}
  </span>
);

const SkeletonGrid = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
      >
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded bg-zinc-800" />
            <div className="h-3 w-1/2 rounded bg-zinc-800" />
          </div>
        </div>
        <div className="mt-5 h-3 w-1/3 rounded bg-zinc-800" />
        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="h-9 rounded-lg bg-zinc-800" />
          <div className="h-9 rounded-lg bg-zinc-800" />
        </div>
      </div>
    ))}
  </div>
);

/* One reusable card for cards / tags / reviews */
const ItemCard = ({
  accent,
  leading,
  title,
  subtitle,
  isActivated,
  details = [],
  viewTo,
  editTo,
}) => {
  const navigate = useNavigate();
  const a = ACCENTS[accent];

  return (
    <article className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-semibold ${a.tint}`}
        >
          {leading}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-zinc-100">{title}</h3>
          <div className="mt-0.5 line-clamp-2 text-sm text-zinc-400">{subtitle}</div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <StatusPill active={isActivated} />
      </div>

      {details.length > 0 && (
        <dl className="mt-4 space-y-2 border-t border-zinc-800 pt-4 text-sm">
          {details.map((d) => (
            <div key={d.label} className="flex items-center justify-between gap-3">
              <dt className="text-zinc-500">{d.label}</dt>
              <dd className="truncate font-mono text-xs text-zinc-300">{d.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2 pt-1">
        <Link
          to={viewTo}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${a.soft} ${FOCUS}`}
        >
          <FiEye size={15} />
          View
        </Link>
        <button
          type="button"
          onClick={() => navigate(editTo, { replace: true })}
          className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 ${FOCUS}`}
        >
          <FiEdit2 size={15} />
          Edit
        </button>
      </div>
    </article>
  );
};

/* Section wrapper: header + loading / list / empty state */
const Section = ({
  accent,
  icon: Icon,
  title,
  items,
  loading,
  hasActive,
  activatePath,
  activateLabel,
  emptyTitle,
  emptyText,
  renderItem,
}) => {
  const navigate = useNavigate();
  const a = ACCENTS[accent];
  const count = items.length;
  const activeCount = items.filter((i) => i.isActivated === true).length;

  return (
    <section className="mb-14">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.tint}`}>
            <Icon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
            <p className="text-sm text-zinc-500">
              {loading
                ? "Loading…"
                : count === 0
                ? "Nothing added yet"
                : `${count} total, ${hasActive ? activeCount : 0} active`}
            </p>
          </div>
        </div>

        {!loading && count === 0 && (
          <button
            type="button"
            onClick={() => navigate(activatePath)}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${a.solid} ${FOCUS}`}
          >
            <FiPlus size={16} />
            {activateLabel}
          </button>
        )}
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : count > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => renderItem(item, index))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-800 px-6 py-12 text-center">
          <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${a.tint}`}>
            <Icon size={26} />
          </div>
          <h3 className="text-base font-semibold text-zinc-100">{emptyTitle}</h3>
          <p className="mt-1 max-w-sm text-sm text-zinc-400">{emptyText}</p>
          <Link
            to={activatePath}
            className={`mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${a.solid} ${FOCUS}`}
          >
            <FiPlus size={16} />
            {activateLabel}
          </Link>
        </div>
      )}
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
const AdminPassToProfile = () => {
  const [copied, setCopied] = useState(false);

  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
    error: balanceError,
  } = useGetBalance();
  const {
    data: cards = [],
    isLoading: isUserCardsLoading,
    isError: isUserCardsError,
    error: userCardsError,
  } = useGetUserCards(balanceData?.userId);
  const {
    data: parkingTags = [],
    isLoading: isTagsLoading,
    isError: isTagsError,
    error: tagsError,
  } = useGetUserParkingTags(balanceData?.userId);
  const {
    data: googleReviews = [],
    isLoading: isReviewsLoading,
    isError: isReviewsError,
    error: reviewsError,
  } = useGetUserGoogleReviews(balanceData?.userId);

  const referralCode = balanceData?.referalCode || "";
  const balance = balanceData?.Balance || 0;

  // useEffect(() => {
  //   if (isBalanceError) {
  //     toast.error(
  //       balanceError?.response?.data?.message || "Failed to load Balance"
  //     );
  //   }
  //   if (isUserCardsError) {
  //     toast.error(
  //       userCardsError?.response?.data?.message || "Failed to load user cards"
  //     );
  //   }
  //   if (isTagsError) {
  //     toast.error(
  //       tagsError?.response?.data?.message || "Failed to load parking tags"
  //     );
  //   }
  //   if (isReviewsError) {
  //     toast.error(
  //       reviewsError?.response?.data?.message || "Failed to load google reviews"
  //     );
  //   }
  // }, [isBalanceError, balanceError, isUserCardsError, userCardsError, isTagsError, tagsError, isReviewsError, reviewsError]);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const hasActiveCards = cards.some((card) => card.isActivated === true);
  const hasActiveTags = parkingTags.some((tag) => tag.isActivated === true);
  const hasActiveReviews = googleReviews.some((review) => review.isActivated === true);

  const shortCode = (v) => (v ? `${v.slice(0, 8)}…` : "");

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#18181b",
            color: "#f4f4f5",
            border: "1px solid #27272a",
          },
          duration: 3000,
        }}
      />

      <Header />

      <main className="min-h-screen bg-zinc-950 pb-16 pt-24 text-zinc-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          {/* Balance + referral */}
          <div className="mb-14 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Wallet size={24} />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Available balance</p>
                  {isBalanceLoading ? (
                    <div className="mt-2 h-8 w-32 animate-pulse rounded-lg bg-zinc-800" />
                  ) : (
                    <p className="mt-0.5 text-3xl font-semibold tracking-tight text-zinc-50">
                      ₹{balance}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                    <Gift size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Your referral code</p>
                    {isBalanceLoading ? (
                      <div className="mt-2 h-6 w-40 animate-pulse rounded-lg bg-zinc-800" />
                    ) : (
                      <p
                        className={`mt-0.5 font-mono ${
                          referralCode
                            ? "text-xl font-semibold text-zinc-50"
                            : "text-sm text-zinc-400"
                        }`}
                      >
                        {referralCode ? referralCode : "Activate a card to get your code"}
                      </p>
                    )}
                  </div>
                </div>

                {!isBalanceLoading && (
                  <button
                    type="button"
                    onClick={copyReferralCode}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 ${FOCUS}`}
                  >
                    {copied ? (
                      <>
                        <FiCheck className="text-emerald-400" size={16} />
                        Copied
                      </>
                    ) : (
                      <>
                        <FiCopy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Digital cards */}
          <Section
            accent="indigo"
            icon={FaIdCard}
            title="Digital cards"
            items={cards}
            loading={isUserCardsLoading}
            hasActive={hasActiveCards}
            activatePath="/card/activate"
            activateLabel="Activate card"
            emptyTitle="No digital cards yet"
            emptyText="Activate your first card to share your profile with a single tap."
            renderItem={(card, index) => (
              <ItemCard
                key={card._id || index}
                accent="indigo"
                leading={card.profile?.name?.charAt(0) || card.name?.charAt(0) || "C"}
                title={card.profile?.name || card.name || "Unnamed card"}
                subtitle={card.profile?.bio || card.bio || "No bio added"}
                isActivated={card.isActivated}
                details={
                  card.activationCode
                    ? [{ label: "Code", value: shortCode(card.activationCode) }]
                    : []
                }
                viewTo={`/profile/${card.activationCode}`}
                editTo={`/profile/edit/${card.activationCode}`}
              />
            )}
          />

          {/* Parking tags */}
          <Section
            accent="emerald"
            icon={FaTags}
            title="Parking tags"
            items={parkingTags}
            loading={isTagsLoading}
            hasActive={hasActiveTags}
            activatePath="/parking-tag/activate"
            activateLabel="Activate parking tag"
            emptyTitle="No parking tags yet"
            emptyText="Activate a tag so people can reach you when your vehicle needs to move."
            renderItem={(tag, index) => (
              <ItemCard
                key={tag._id || index}
                accent="emerald"
                leading={<FaTags size={18} />}
                title={tag?.profile?.ownerName || "Parking tag"}
                subtitle={
                  tag?.profile?.vehicleNumber
                    ? `Vehicle: ${tag.profile.vehicleNumber}`
                    : "Vehicle number not added"
                }
                isActivated={tag.isActivated}
                details={[
                  ...(tag.activationCode
                    ? [{ label: "Code", value: shortCode(tag.activationCode) }]
                    : []),
                  ...(tag.tagId ? [{ label: "Tag ID", value: shortCode(tag.tagId) }] : []),
                ]}
                viewTo={`/profile/P/${tag.activationCode}`}
                editTo={`/profile/P/edit/${tag.activationCode}`}
              />
            )}
          />

          {/* Google reviews */}
          <Section
            accent="rose"
            icon={MdOutlineReviews}
            title="Google reviews"
            items={googleReviews}
            loading={isReviewsLoading}
            hasActive={hasActiveReviews}
            activatePath="/google-reviews/activate"
            activateLabel="Activate Google review"
            emptyTitle="No Google review links yet"
            emptyText="Activate a review link to collect customer feedback faster."
            renderItem={(review, index) => (
              <ItemCard
                key={review._id || index}
                accent="rose"
                leading={<MdOutlineReviews size={22} />}
                title={review.profile?.brandName || "Google review"}
                subtitle={
                  review.profile?.googleReviewLink ? (
                    <a
                      href={review.profile.googleReviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-rose-300 underline-offset-2 hover:underline"
                    >
                      {review.profile.googleReviewLink.length > 40
                        ? `${review.profile.googleReviewLink.substring(0, 40)}…`
                        : review.profile.googleReviewLink}
                    </a>
                  ) : (
                    "No review link added"
                  )
                }
                isActivated={review.isActivated}
                details={
                  review.activationCode
                    ? [{ label: "Code", value: shortCode(review.activationCode) }]
                    : []
                }
                viewTo={`/profile/google-review/${review.activationCode}`}
                editTo={`/profile/google-review/edit/${review.activationCode}`}
              />
            )}
          />

          {/* Referral dashboard */}
          <ReferralDashboard />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AdminPassToProfile;
