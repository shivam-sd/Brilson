import { Car, Phone, ScanLine, ArrowRight, BellRing, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function ParkingTagBanner() {
    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0c] to-black font-[Inter]">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        @keyframes floaty {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-12px) rotate(-0.5deg); }
        }
        .float-card { animation: floaty 6.5s ease-in-out infinite; }
        @keyframes buzz {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(-8deg); }
          30% { transform: rotate(8deg); }
          45% { transform: rotate(-6deg); }
          60% { transform: rotate(6deg); }
          75% { transform: rotate(0deg); }
        }
        .buzz-icon { animation: buzz 3.5s ease-in-out infinite; }
      `}</style>

            {/* Thin top hairline — gives a clean seam against black instead of the old navy-to-navy blend */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="pointer-events-none absolute left-1/4 h-[30rem] w-[30rem] rounded-full bg-[#4F8CFF] opacity-[0.06] blur-[130px]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_60%)]" />

            <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 pb-5 pt-10 lg:flex-row lg:justify-between lg:gap-8 lg:px-12 lg:pt-8">
                <div className="relative flex w-full max-w-md items-center justify-center lg:max-w-lg">

                    <div className="absolute -bottom-4 -left-4 z-10 flex items-center gap-2 rounded-xl bg-[#111318] px-4 py-2.5 shadow-xl ring-1 ring-white/10">
                        <ShieldCheck className="h-4 w-4 text-[#5B9BFF]" />
                        <span className="font-display text-xs font-semibold text-[#F5F6F7]">
                            Secure &amp; verified
                        </span>
                    </div>

                    <div className="float-card w-full max-w-sm overflow-hidden rounded-[28px] bg-white p-3 shadow-2xl ring-1 ring-white/10 lg:max-w-md">
                        <img
                            src={"./parkingcard.png"}
                            alt="Brilson parking tag QR scan"
                            className="w-full rounded-[20px]"
                        />
                    </div>
                </div>

                <div className="w-full max-w-xl text-center lg:text-left">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">
                        <Car className="h-3.5 w-3.5 text-[#5B9BFF]" />
                        <span className="font-display text-xs font-semibold tracking-[0.2em] text-[#9198A6]">
                            BRILSON PARKING TAG
                        </span>
                    </div>

                    <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-[#F5F6F7] sm:text-5xl">
                        Never Get Blocked
                        <br />
                        In Again
                    </h2>

                    <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-[#9198A6] lg:mx-0">
                        Stick it on your dashboard. Anyone can scan it to call or message
                        you instantly
                    </p>


                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                        <Link to="/products" className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5B9BFF] to-[#3E77E0] px-7 py-3.5 font-display text-sm font-semibold text-[#0A0B0D] shadow-[0_8px_32px_-8px_rgba(79,140,255,0.55)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_12px_40px_-8px_rgba(79,140,255,0.75)] active:scale-[0.98]">
                            Get Your Tag
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                        <Link to={"/how-it-works"} className="rounded-xl border border-white/15 px-7 py-3.5 font-display text-sm font-semibold text-[#F5F6F7] transition-all duration-200 hover:bg-white/5 hover:border-white/25">
                            See How It Works
                        </Link>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-6 text-xs text-[#9198A6] lg:justify-start">
                        <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-[#5B9BFF]" />
                            Number stays private
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ScanLine className="h-3.5 w-3.5 text-[#5B9BFF]" />
                            Scan and call in seconds
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
