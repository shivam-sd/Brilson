import { useEffect, useRef, useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";
import { optimizeImage } from "../../utils/helpers";
import SafeImage from "../ui/SafeImage";

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80"
    >
      {copied ? <LuCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" /> : <LuCopy className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}

export default function PaymentDetails({ data }) {
  const d = data?.paymentDetails ?? {};
  const rows = [
    { label: "UPI ID", value: data?.upi },
    { label: "Bank", value: d.bankName },
    { label: "Account holder", value: d.bankHolderName },
    { label: "Account number", value: d.accountNumber },
    { label: "IFSC code", value: d.ifscCode },
  ].filter((r) => r.value);

  if (!rows.length && !data?.image) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <h4 className="mb-3 text-sm font-semibold text-white">Payment details</h4>
      <div className="flex flex-col gap-4 sm:flex-row">
        {data?.image && (
          <SafeImage
            src={data.image}
            alt="Payment QR code"
            className="h-36 w-36 shrink-0 self-center rounded-lg sm:self-start"
            imgClassName="object-contain"
          />
        )}
        <dl className="min-w-0 flex-1 divide-y divide-white/[0.06]">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-3 py-1.5 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <dt className="text-xs text-slate-400">{label}</dt>
                <dd className="truncate text-sm font-medium text-white">{value}</dd>
              </div>
              <CopyButton value={value} label={label} />
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
