import { memo } from "react";
import { CONTACT_ICONS } from "../data/profileConfig";
import { cn } from "../utils/helpers";
import { downloadVCard } from "../utils/vcard";

const tile = cn(
  "cursor-pointer flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-1.5 py-2",
  "text-center text-[11px] font-medium leading-tight text-slate-100 sm:text-xs",
  "transition duration-200 hover:-translate-y-0.5 md:hover:border-orange-400/40 md:hover:bg-white/[0.07] md:hover:shadow-[0_10px_24px_-12px_rgba(249,115,22,0.55)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/80 motion-reduce:transition-none",
  "disabled:pointer-events-none disabled:opacity-40"
);

function ActionTile({ iconKey, label, href, external, onClick }) {
  const { Icon, className } = CONTACT_ICONS[iconKey];
  const inner = (
    <>
      <Icon className={cn("h-[18px] w-[18px]", className)} aria-hidden="true" />
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={tile} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={tile} onClick={onClick} disabled={!onClick}>
      {inner}
    </button>
  );
}

function ContactActions({ profile }) {
  const { contacts, name, website, location, tagline } = profile;
  const whatsappNumber = contacts.whatsapp.replace(/\D/g, "");

  return (
    <div className="grid grid-cols-4 gap-2 min-[420px]:grid-cols-4">
      <ActionTile iconKey="call" label="Call" href={contacts.phone ? `tel:${contacts.phone}` : null} />
      <ActionTile
        iconKey="whatsapp"
        label="WhatsApp"
        external
        href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : null}
      />
      <ActionTile iconKey="email" label="Email" href={contacts.email ? `mailto:${contacts.email}` : null} />
      <ActionTile
        iconKey="save"
        label="Save Contact"
        onClick={() =>
          downloadVCard({
            name,
            phone: contacts.phone,
            whatsapp: contacts.whatsapp,
            email: contacts.email,
            website,
            city: location,
            note: tagline,
          })
        }
      />
    </div>
  );
}

export default memo(ContactActions);
