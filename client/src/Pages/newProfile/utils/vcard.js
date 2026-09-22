const esc = (s = "") =>
  String(s).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

export function buildVCard({ name, phone, whatsapp, email, website, city, note }) {
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${esc(name)}`, `N:;${esc(name)};;;`];
  if (phone) lines.push(`TEL;TYPE=CELL:${phone}`);
  if (whatsapp && whatsapp !== phone) lines.push(`TEL;TYPE=CELL:${whatsapp}`);
  if (email) lines.push(`EMAIL;TYPE=INTERNET:${email}`);
  if (website) lines.push(`URL:${website}`);
  if (city) lines.push(`ADR;TYPE=WORK:;;;${esc(city)};;;`);
  if (note) lines.push(`NOTE:${esc(note)}`);
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function downloadVCard(data) {
  const blob = new Blob([buildVCard(data)], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(data.name || "contact").replace(/[^\w-]+/g, "_")}.vcf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
