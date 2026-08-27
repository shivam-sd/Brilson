import { ArrowRight, Wifi, Share2, ShieldCheck } from "lucide-react";

export default function NfcCardBanner() {
    return (
        <div className="relative w-full overflow-hidden bg-[#0A0B0D] font-[Inter]">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        @keyframes ringPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(79,140,255,0.35); }
          50% { box-shadow: 0 0 0 14px rgba(79,140,255,0); }
        }
        .ring-pulse { animation: ringPulse 3.2s ease-in-out infinite; }
        @keyframes floaty {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-12px) rotate(-3deg); }
        }
        .float-card { animation: floaty 6.5s ease-in-out infinite; }
        @keyframes dialSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .dial-spin { animation: dialSpin 12s linear infinite; }
      `}</style>

            <div className="pointer-events-none absolute -top-32 left-1/3 h-[30rem] w-[30rem] rounded-full bg-[#4F8CFF] opacity-[0.08] blur-[130px]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.04),transparent_60%)]" />

            <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-16 px-6 pb-10 pt-5 lg:flex-row lg:justify-between lg:gap-8 lg:px-12 lg:pt-5">
                <div className="w-full max-w-xl text-center lg:text-left">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">
                        <Wifi className="h-3.5 w-3.5 text-[#4F8CFF]" />
                        <span className="font-display text-xs font-semibold tracking-[0.2em] text-[#8B92A0]">
                            BRILSON NFC CARD
                        </span>
                    </div>

                    <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-[#F5F6F7] sm:text-6xl">
                        Your details,
                        <br />
                        delivered in one tap
                    </h1>

                    <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-[#8B92A0] lg:mx-0">
                        Hold your Brilson card near any phone and your contact, socials and portfolio
                        open instantly. No app, no typing, no reprints when your details change.
                    </p>

                    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                        <span className="font-display text-sm font-medium text-[#8B92A0]">
                            Starting at
                        </span>
                        <span className="font-display text-4xl font-bold text-[#F5F6F7]">₹499</span>
                        <span className="text-sm text-[#8B92A0]">/ one-time</span>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                        <button className="group flex items-center justify-center gap-2 rounded-xl bg-[#4F8CFF] px-7 py-3.5 font-display text-sm font-semibold text-[#0A0B0D] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]">
                            Get Your Card
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                        <button className="rounded-xl border border-white/15 px-7 py-3.5 font-display text-sm font-semibold text-[#F5F6F7] transition-colors duration-200 hover:bg-white/5">
                            See How It Works
                        </button>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-6 text-xs text-[#8B92A0] lg:justify-start">
                        <div className="flex items-center gap-1.5">
                            <Share2 className="h-3.5 w-3.5 text-[#4F8CFF]" />
                            Unlimited profile updates
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-[#4F8CFF]" />
                            Works with any smartphone
                        </div>
                    </div>
                </div>

                <div className="relative flex h-[420px] w-full max-w-sm items-center justify-center lg:h-[480px]">
                    <div className="float-card relative h-56 w-[21rem] rounded-2xl bg-gradient-to-br from-[#1C1E22] via-[#16181C] to-[#0A0B0D] p-6 shadow-2xl ring-1 ring-white/10">
                        <div className="flex h-full flex-col justify-between">
                            <div className="flex items-start justify-between">
                                <span className="font-display text-xl font-bold tracking-tight text-[#F5F6F7]">
                                    Brilson
                                </span>
                                <div className="ring-pulse rounded-full bg-white/[0.06] p-2 ring-1 ring-white/10">
                                    <Wifi className="h-4 w-4 text-[#4F8CFF]" />
                                </div>
                            </div>

                            <div className="relative mx-auto h-20 w-20">
                                <div className="dial-spin absolute inset-0 rounded-full border border-dashed border-[#4F8CFF]/30" />
                                <div className="absolute inset-2 rounded-full border border-[#4F8CFF]/50" />
                                <div className="absolute inset-[34%] rounded-full bg-[#4F8CFF]/20 ring-1 ring-[#4F8CFF]/60" />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="font-display text-xs font-medium tracking-[0.15em] text-[#8B92A0]">
                                    DIGITAL BUSINESS CARD
                                </span>
                                <span className="font-display text-[10px] font-semibold tracking-widest text-[#8B92A0]/70">
                                    NFC
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-4 -right-2 h-16 w-32 rotate-[10deg] rounded-md bg-[#16181C] shadow-xl ring-1 ring-white/10 sm:-right-6">
                        <div className="absolute inset-x-2 top-2 h-1 rounded-full bg-[#4F8CFF]/40" />
                    </div>
                </div>
            </div>
        </div>
    );
}