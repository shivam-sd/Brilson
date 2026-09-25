import { FaLocationDot } from "react-icons/fa6";
import { LuExternalLink, LuStar } from "react-icons/lu";
import { useGetLocation } from "../../api/profileApi";
import { ensureUrl } from "../../utils/helpers";
import QueryState from "../ui/QueryState";

function LinkButton({ href, icon: Icon, title, hint }) {
  return (
    <a
      href={href}
      target="_blank" aria-label="googlereview"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors duration-200 hover:border-indigo-400/40 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#2a2a8c]">
        <Icon className="h-5 w-5 text-indigo-200" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-white">{title}</span>
        <span className="block text-xs text-slate-400">{hint}</span>
      </span>
      <LuExternalLink
        className="h-4 w-4 shrink-0 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
        aria-hidden="true"
      />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export default function GoogleReviewSection({ code }) {
  const query = useGetLocation(code);
  const mapLink = ensureUrl(query.data?.data?.googleMapLink);
  const reviewLink = ensureUrl(query.data?.data?.googleReviewLink);

  return (
    <QueryState query={query} isEmpty={!mapLink && !reviewLink} emptyText="No Google links added yet.">
      <div className="grid gap-2.5 sm:grid-cols-2">
        {mapLink && <LinkButton href={mapLink} icon={FaLocationDot} title="Open in Google Maps" hint="Get directions" />}
        {reviewLink && <LinkButton href={reviewLink} icon={LuStar} title="Review on Google" hint="Share your feedback" />}
      </div>
    </QueryState>
  );
}
