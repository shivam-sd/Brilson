/** Join class names, skipping falsy values. */
export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const digitsOnly = (value = "") => String(value ?? "").replace(/\D/g, "");

/** "+91" + "8696916676" -> "+918696916676" */
export const buildPhone = (countryCode, number) => {
  const cc = digitsOnly(countryCode);
  const n = digitsOnly(number);
  if (!n) return "";
  return `${cc ? `+${cc}` : ""}${n}`;
};

/**
 * Makes API-provided links safe + clickable.
 * - "brilson.in"            -> "https://brilson.in"
 * - "https://x.com/abc"     -> unchanged
 * - "javascript:..." etc.   -> null (blocked)
 */
export const ensureUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const value = url.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return null;
  return `https://${value}`;
};

export const hostnameOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export const formatPrice = (price) => {
  const n = Number(price);
  if (!Number.isFinite(n) || n <= 0) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
};

export const optimizeImage = (url, width = 800) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) return url;
  if (/\.pdf($|\?)/i.test(url)) return url;
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,w_${width}/`);
};

export const isNotFound = (error) => error?.response?.status === 404;

export const getActivationCode = () => {
  if (typeof window === "undefined") return null;
  const fromQuery = new URLSearchParams(window.location.search).get("code");
  if (fromQuery) return fromQuery;
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts.length ? parts[parts.length - 1] : null;
};
