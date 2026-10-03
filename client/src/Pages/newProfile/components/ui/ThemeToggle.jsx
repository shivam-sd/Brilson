export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <>
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="lg:hidden fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] text-lg shadow-md transition hover:scale-105 cursor-pointer"
    >
      {isDark ? "☀️" : "🌙"}
    </button>

    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="fixed right-4 top-4 z-50 lg:flex hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] text-lg shadow-md transition hover:scale-105 cursor-pointer"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
      </>
  );
}