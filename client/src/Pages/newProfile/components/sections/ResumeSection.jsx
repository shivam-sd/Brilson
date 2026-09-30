import { LuExternalLink, LuFileText } from "react-icons/lu";
import { useGetResume } from "../../api/profileApi";
import { ensureUrl } from "../../utils/helpers";
import QueryState from "../ui/QueryState";

export default function ResumeSection({ code }) {
  const query = useGetResume(code);
  const url = ensureUrl(query.data?.resume?.resume);
  const fileName = query.data?.resume?.name || "Resume.pdf";

  return (
    <QueryState query={query} isEmpty={!url} emptyText="No resume uploaded yet.">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="resume"
        className="group flex items-center gap-3.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-2)] p-3.5 transition-colors duration-200 hover:border-rose-400/60 hover:bg-[var(--p-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/70"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#8c0f2e]">
          <LuFileText className="h-5 w-5 text-rose-300" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-[color:var(--p-text)]">{fileName}</span>
          <span className="block text-xs text-[color:var(--p-muted)]">Opens in a new tab</span>
        </span>
        <LuExternalLink
          className="h-4 w-4 shrink-0 text-[color:var(--p-muted)] transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
          aria-hidden="true"
        />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </QueryState>
  );
}