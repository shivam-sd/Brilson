import { SOCIAL_PLATFORMS } from "../data/profileConfig";
import { buildPhone, ensureUrl } from "./helpers";

export function normalizeProfile(cardRes, logoRes, reviewLink) {
  if (!cardRes) return null;

  const p = cardRes.profile ?? cardRes.card?.profile ?? {};
  const image = logoRes?.image ?? "";

  const socialLinks = Object.keys(SOCIAL_PLATFORMS)
    .map((platform) => ({ platform, url: ensureUrl(p[platform]) }))
    .filter((link) => link.url);

  return {
    name: p.name?.trim() || "Unnamed profile",
    tagline: p.bio || p.about || "",
    location: p.city || "",
    about: p.about || p.bio || "",
    website: ensureUrl(p.website),
    verified: cardRes.card?.isActivated !== false,

    // one image is used for both the cover and the avatar
    profileImage: image,
    coverImage: image,

    contacts: {
      phone: buildPhone(p.countryCode, p.phone),
      whatsapp: buildPhone(p.WacountryCode ?? p.countryCode, p.whatsapp),
      email: p.email || "",
    },
    socialLinks,
    reviewLink,
    profileId: cardRes?.card?.owner?._id,
  };
}
