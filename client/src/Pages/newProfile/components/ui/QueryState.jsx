import { isNotFound } from "../../utils/helpers";

export function SectionSkeleton({ rows = 2 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl bg-[var(--p-surface-2)] motion-reduce:animate-none" />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function EmptyState({ children = "Nothing added here yet." }) {
  return (
    <p className="rounded-xl border border-dashed border-[var(--p-border)] px-4 py-6 text-center text-sm text-[color:var(--p-muted)]">
      {children}
    </p>
  );
}

export default function QueryState({ query, isEmpty, emptyText, skeleton, children }) {
  if (query.isLoading) return skeleton ?? <SectionSkeleton />;

  if (query.isError && !isNotFound(query.error)) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-[var(--p-danger-border)] bg-[var(--p-danger-bg)] px-4 py-5 text-center"
      >
        <p className="text-sm text-[color:var(--p-danger)]">Couldn&apos;t load this section.</p>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="mt-3 rounded-lg border border-[var(--p-border)] px-3.5 py-1.5 text-sm font-medium text-[color:var(--p-text)] transition-colors hover:bg-[var(--p-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/80"
        >
          Try again
        </button>
      </div>
    );
  }

  if (query.isError || isEmpty) return <EmptyState>{emptyText}</EmptyState>;
  return children;
}