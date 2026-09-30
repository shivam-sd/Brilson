import { LuExternalLink } from "react-icons/lu";
import { SECTION_THEMES } from "../../data/profileConfig";
import { cn, ensureUrl, formatPrice, hostnameOf } from "../../utils/helpers";
import SafeImage from "./SafeImage";

export default function ItemCard({ item, color = "orange" }) {
  const theme = SECTION_THEMES[color];
  const { title, description, image, price, link, features } = item;
  const href = ensureUrl(link);
  const priceLabel = formatPrice(price);

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-2)] sm:flex-row">
      {image && (
        <SafeImage
          src={image}
          alt={title}
          fit="contain"
          className="w-full shrink-0 bg-[var(--p-surface-2)] sm:w-52 sm:self-stretch"
          imgClassName="h-auto w-full sm:h-full sm:object-contain"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h4 className="min-w-0 text-base font-semibold leading-snug text-[color:var(--p-text)]">
            {title}
          </h4>

          {priceLabel && (
            <span className="shrink-0 rounded-full border border-[var(--p-border)] bg-[var(--p-surface-2)] px-2.5 py-1 text-xs font-semibold text-[color:var(--p-text)]">
              {priceLabel}
            </span>
          )}
        </div>

        {description && (
          <p className="break-words text-sm leading-relaxed text-[color:var(--p-muted)]">
            {description}
          </p>
        )}

        {features?.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {features.map((feature) => (
              <li
                key={feature}
                className="rounded-md bg-[var(--p-surface-2)] px-2 py-1 text-xs text-[color:var(--p-muted)]"
              >
                {feature}
              </li>
            ))}
          </ul>
        )}

        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${title} (${hostnameOf(href)}) in a new tab`}
            className={cn(
              "mt-auto inline-flex items-center gap-1.5 self-start rounded-md pt-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2",
              theme.accent,
              theme.focus
            )}
          >
            {hostnameOf(href)}
            <LuExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}