import { useState, useEffect } from "react";
import { ArrowRight, Wifi, Share2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const CARD_IMAGES = [
    "/nfc_cards/brilson-nfc-card-1.png",
    "/nfc_cards/brilson-nfc-card-3.png",
    "/nfc_cards/brilson-nfc-card-4.png",
    "/nfc_cards/brilson-nfc-card-5.png",
    "/nfc_cards/brilson-nfc-card-7.png",
    "/nfc_cards/brilson-nfc-card-8.png",
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
        <div className="relative w-full overflow-hidden   bg-gradient-to-r from-[#07133d] via-[#0c1e4a] to-[#142d5a] font-[Inter]">
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
                        opacity: 0.15;
                        transform: translate(-50%, -50%) scale(1);
                    }

                    50% {
                        opacity: 0.3;
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

            <div className="pointer-events-none absolute -top-32 left-1/3 h-[30rem] w-[30rem] rounded-full bg-[#4F8CFF] opacity-[0.08] blur-[130px]" />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.04),transparent_60%)]" />

            <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-8 px-6 pb-10 pt-2 lg:flex-row lg:justify-between lg:gap-8 lg:px-12 lg:pt-5">

                {/* LEFT CONTENT */}
                <div className="w-full max-w-xl px-5 text-center lg:text-left">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">
                        <Wifi className="h-3.5 w-3.5 text-[#4F8CFF]" />

                        <span className="font-display text-xs font-semibold tracking-[0.2em] text-[#8B92A0]">
                            BRILSON NFC CARD
                        </span>
                    </div>

                    <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-[#F5F6F7] sm:text-5xl">
                        Your Details,
                        <br />
                        Delivered In One Tap
                    </h2>

                    <p className="mx-auto mt-6 max-w-md text-md leading-relaxed text-[#8B92A0] lg:mx-0">
                        Hold your Brilson card near any phone and your contact, socials and portfolio
                        open instantly. No app, no typing, no reprints when your details change.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                        <Link
                            to="/products"
                            className="group border border-white/15 flex items-center justify-center gap-2 rounded-xl  px-7 py-3.5 font-display text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] hover:bg-white/5"
                        >
                            Get Your NFC Card

                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>

                        <Link
                            to="/how-it-works"
                            className="rounded-xl border border-white/15 px-7 py-3.5 font-display text-sm font-semibold text-[#F5F6F7]  transition-transform hover:scale-[1.03] active:scale-[0.98] duration-200 hover:bg-white/5"
                        >
                            See How It Works
                        </Link>
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

                <div className="relative flex h-[330px] w-full max-w-sm items-center justify-center px-5 lg:h-[480px]">

                    <div className="glow-pulse pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 rounded-full bg-[#4F8CFF] blur-[80px]" />

                    <div className="float-card relative h-full w-full">
                        {CARD_IMAGES.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt="Brilson NFC digital business card"
                                onError={() => handleImageError(index)}
                                className="card-fade absolute inset-0 h-full w-full object-contain drop-shadow-2xl"
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
                                    ? "w-6 bg-[#4F8CFF]"
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