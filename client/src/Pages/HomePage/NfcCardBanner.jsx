import { useState, useEffect } from "react";
import { ArrowRight, Wifi, Share2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const CARD_IMAGES = [
    "/nfc_cards/brilson-nfc-card-1.png",
    "/nfc_cards/brilson-nfc-card-2.png",
    "/nfc_cards/brilson-nfc-card-3.png",
    "/nfc_cards/brilson-nfc-card-4.png",
    "/nfc_cards/brilson-nfc-card-5.png",
    "/nfc_cards/brilson-nfc-card-6.png",
    "/nfc_cards/brilson-nfc-card-7.png",
    "/nfc_cards/brilson-nfc-card-8.png",
    "/nfc_cards/brilson-nfc-card-9.png",
    "/nfc_cards/brilson-nfc-card-10.jpeg"
];

const IMAGE_COUNT = CARD_IMAGES.length;

export default function NfcCardBanner() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (IMAGE_COUNT <= 1) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % IMAGE_COUNT);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleImageError = (index) => {
        if (index === activeIndex) {
            setActiveIndex((prev) => (prev + 1) % IMAGE_COUNT);
        }
    };

    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0c] to-black font-[Inter]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

                .font-display {
                    font-family: 'Space Grotesk', sans-serif;
                }

                @keyframes floaty {
                    0%, 100% {
                        transform: translateY(0px) rotate(-3deg);
                    }

                    50% {
                        transform: translateY(-16px) rotate(2deg);
                    }
                }

                .float-card {
                    animation: floaty 6s ease-in-out infinite;
                }

                @keyframes glowPulse {
                    0%, 100% {
                        opacity: 0.12;
                        transform: translate(-50%, -50%) scale(1);
                    }

                    50% {
                        opacity: 0.24;
                        transform: translate(-50%, -50%) scale(1.15);
                    }
                }

                .glow-pulse {
                    animation: glowPulse 4s ease-in-out infinite;
                }

                .card-fade {
                    transition: opacity 0.8s ease-in-out;
                }
            `}</style>

            {/* Thin top hairline — on black there's no natural blend from the section above, so this gives a clean seam */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="pointer-events-none absolute -top-32 left-1/3 h-[30rem] w-[30rem] rounded-full bg-[#4F8CFF] opacity-[0.06] blur-[130px]" />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_60%)]" />

            <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-8 px-6 pb-10 pt-2 lg:flex-row lg:justify-between lg:gap-8 lg:px-12 lg:pt-5">

                {/* LEFT CONTENT */}
                <div className="w-full max-w-xl px-5 text-center lg:text-left">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">
                        <Wifi className="h-3.5 w-3.5 text-[#5B9BFF]" />

                        <span className="font-display text-xs font-semibold tracking-[0.2em] text-[#9198A6]">
                            BRILSON NFC CARD
                        </span>
                    </div>

                    <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-[#F5F6F7] sm:text-5xl">
                        Your Details,  Delivered
                        <br />
                        In One Tap
                    </h2>

                    <p className="mx-auto mt-6 max-w-md text-md leading-relaxed text-[#9198A6] lg:mx-0">
                        Hold your Brilson card near any phone and your contact, socials and portfolio
                        open instantly. No app, no typing, no reprints when your details change.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                        <Link
                            to="/products"
                            className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E6BE6] to-[#0447c2] px-7 py-3.5 font-display text-sm font-semibold text-white shadow-[0_8px_32px_-8px_rgba(47,107,230,0.55)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_12px_40px_-8px_rgba(47,107,230,0.75)] active:scale-[0.98]"
                        >
                            Get Your NFC Card

                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>

                        <Link
                            to="/how-it-works"
                            className="rounded-xl border border-white/15 px-7 py-3.5 font-display text-sm font-semibold text-[#F5F6F7] transition-all duration-200 hover:scale-[1.03] hover:bg-white/5 hover:border-white/25 active:scale-[0.98]"
                        >
                            See How It Works
                        </Link>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-6 text-xs text-[#9198A6] lg:justify-start">
                        <div className="flex items-center gap-1.5">
                            <Share2 className="h-3.5 w-3.5 text-[#5B9BFF]" />
                            Unlimited profile updates
                        </div>

                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-[#5B9BFF]" />
                            Works with any smartphone
                        </div>
                    </div>
                </div>

                <div className="relative flex h-[330px] w-full max-w-sm items-center justify-center px-5 lg:h-[480px]">

                    <div className="glow-pulse pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 rounded-full bg-[#4F8CFF] blur-[80px]" />

                    <div className="float-card relative h-full w-full">
                        {CARD_IMAGES.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt="Brilson NFC digital business card"
                                onError={() => handleImageError(index)}
                                className="card-fade absolute inset-0 h-full w-full object-contain drop-shadow-2xl lg:scale-130"
                                style={{
                                    opacity: index === activeIndex ? 1 : 0,
                                }}
                            />
                        ))}
                    </div>

                    <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-2 lg:-bottom-1">
                        {Array.from({ length: IMAGE_COUNT }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                aria-label={`Show card image ${index + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex
                                    ? "w-6 bg-[#5B9BFF]"
                                    : "w-1.5 bg-white/20"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
