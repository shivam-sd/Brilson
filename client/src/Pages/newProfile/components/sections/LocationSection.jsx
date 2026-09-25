import { FaEnvelope, FaLocationDot, FaPhone, FaWhatsapp } from "react-icons/fa6";
import { LuStar } from "react-icons/lu";
import { useGetLocation, useGetPaymentDetails } from "../../api/profileApi";
import { cn, ensureUrl } from "../../utils/helpers";
import PaymentDetails from "./PaymentDetails";
import { FaMap } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80";

function InfoRow({
  icon: Icon,
  iconClass,
  label,
  value,
  href,
  external = false,
}) {
  const Tag = href ? "a" : "div";

  const linkProps = href
    ? {
      href,
      ...(external
        ? {
          target: "_blank",
          rel: "noopener noreferrer",
        }
        : {}),
    }
    : {};

  return (
    <Tag
      {...linkProps}
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3",
        href &&
        cn(
          "cursor-pointer transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06]",
          focusRing
        )
      )}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06]">
        <Icon
          className={cn("h-4 w-4", iconClass)}
          aria-hidden="true"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs text-slate-400">
          {label}
        </span>

        <span
          className={cn(
            "block text-sm font-medium text-white",
            label === "Location"
              ? "break-words leading-5"
              : "truncate"
          )}
        >
          {value}
        </span>
      </span>

      {href && external && (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-orange-500/10 text-orange-400">
          <FiExternalLink
            className="h-4 w-4"
            aria-hidden="true"
          />
        </span>
      )}
    </Tag>
  );
}

function LinkButton({ href, icon: Icon, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer" aria-label="locations"
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-100",
        "transition-colors duration-200 hover:bg-amber-400/20",
        focusRing
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

const Bar = ({ className }) => (
  <div className={cn("h-12 animate-pulse rounded-xl bg-white/[0.06] motion-reduce:animate-none", className)} />
);

export default function LocationSection({ code, profile }) {
  const locationQ = useGetLocation(code);

  const mapLink = ensureUrl(locationQ.data?.data?.googleMapLink);
  const reviewLink = ensureUrl(locationQ.data?.data?.googleReviewLink);
  const contacts = profile?.contacts ?? {};

  return (
    <div className="space-y-3">
      <div className="grid gap-2.5 sm:grid-cols-1">
        {/* {contacts.phone && <InfoRow icon={FaPhone} iconClass="text-orange-400" label="Phone" value={contacts.phone} href={`tel:${contacts.phone}`} />}
        {contacts.whatsapp && (
          <InfoRow
            icon={FaWhatsapp}
            iconClass="text-[#25d366]"
            label="WhatsApp"
            value={contacts.whatsapp}
            href={`https://wa.me/${contacts.whatsapp.replace(/\D/g, "")}`}
            external
          />
        )}
        {contacts.email && <InfoRow icon={FaEnvelope} iconClass="text-amber-400" label="Email" value={contacts.email} href={`mailto:${contacts.email}`} />} */}
        {profile?.location && (
          <InfoRow
            icon={FaLocationDot}
            iconClass="text-orange-500"
            label="Location"
            value={profile.location}
            href={mapLink}
            external

          />
        )}
      </div>

      {/* {locationQ.isLoading ? (
        <Bar />
      ) : (
        (mapLink || reviewLink) && (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {mapLink && <LinkButton href={mapLink} icon={FaLocationDot}>Open in Google Maps</LinkButton>}
            {reviewLink && <LinkButton href={reviewLink} icon={LuStar}>Review on Google</LinkButton>}
          </div>
        )
      )} */}

      {/* {paymentQ.isLoading ? <Bar className="h-28" /> : <PaymentDetails data={paymentQ.data?.data} />} */}
    </div>
  );
}
