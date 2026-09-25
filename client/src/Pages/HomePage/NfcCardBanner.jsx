import { useState, useEffect } from "react";
import { ArrowRight, Wifi, Share2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const CARD_IMAGES = [
    "/nfc_cards/brilson-nfc-card-1.webp",
    "/nfc_cards/brilson-nfc-card-2.webp",
    "/nfc_cards/brilson-nfc-card-3.webp",
    "/nfc_cards/brilson-nfc-card-4.webp",
    "/nfc_cards/brilson-nfc-card-5.webp",
    "/nfc_cards/brilson-nfc-card-6.webp",
    "/nfc_cards/brilson-nfc-card-7.webp",
    "/nfc_cards/brilson-nfc-card-8.webp",
    "/nfc_cards/brilson-nfc-card-9.webp",
    "/nfc_cards/brilson-nfc-card-10.webp"
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

    const handleImageError = () => {
        setActiveIndex((prev) => (prev + 1) % IMAGE_COUNT);
    };

    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0c] to-black font-[Inter]">
            {/*
              NOTE: Space Grotesk font is no longer imported here via @import
              (that was render-blocking and added an extra network request on
              every page load). Add this ONE line to your main index.html
              <head> instead, with preconnect — it loads in parallel with the
              page instead of blocking it:

              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

              Font-family below still points to 'Space Grotesk' so the look
              stays exactly the same once you add that link tag.
            */}
            <style>{`
                .font-display {
                    font-family: 'Space Grotesk', sans-serif;
                }

                .float-card {
                    animation: floaty 6s ease-in-out infinite;
                }

                @keyframes floaty {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .glow-pulse {
                    opacity: 0.16;
                }

                .card-fade {
                    transition: opacity 0.8s ease-in-out;
                }
            `}</style>

            {/* Thin top hairline */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Smaller, static ambient glow (was a 30rem animated 130px blur — very expensive to paint every frame) */}
            <div className="pointer-events-none absolute -top-32 left-1/3 h-[20rem] w-[20rem] rounded-full bg-[#4F8CFF] opacity-[0.05] blur-[80px]" />

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

                    <div className="glow-pulse pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4F8CFF] blur-[60px]" />

                    <div className="float-card relative h-full w-full">
                        {/*
                          Only the CURRENT image is mounted in the DOM now
                          (previously all 10 images were downloaded + decoded
                          on page load, opacity:0 or not). Browser only
                          fetches one image at a time, and the next one just
                          before it's needed.
                        */}
                        <img
                            key={activeIndex}
                            src={CARD_IMAGES[activeIndex]}
                            alt="Brilson NFC digital business card"
                            onError={handleImageError}
                            width={400}
                            height={480}
                            loading={activeIndex === 0 ? "eager" : "lazy"}
                            fetchpriority={activeIndex === 0 ? "high" : "auto"}
                            decoding="async"
                            className="card-fade absolute inset-0 h-full w-full object-contain drop-shadow-2xl lg:scale-130"
                        />
                        {/* Preload the next image quietly so the crossfade still feels instant */}
                        <link
                            rel="preload"
                            as="image"
                            href={CARD_IMAGES[(activeIndex + 1) % IMAGE_COUNT]}
                        />
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
