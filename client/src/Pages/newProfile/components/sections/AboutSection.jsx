import { LuExternalLink } from "react-icons/lu";
import { hostnameOf } from "../../utils/helpers";
import { EmptyState, SectionSkeleton } from "../ui/QueryState";

export default function AboutSection({ profile }) {
  if (!profile) return <SectionSkeleton rows={1} />;

  const { about, website } = profile;
  if (!about && !website) return <EmptyState />;

  return (
    <div className="space-y-4">
      {about && <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-300">{about}</p>}
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-blue-400/25 bg-blue-500/10 px-3.5 py-2 text-sm font-medium text-blue-200 transition-colors hover:bg-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
        >
          {hostnameOf(website)}
          <LuExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}
