import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Wifi, Leaf, UserCheck, TrendingUp, ArrowRight, Sparkles, Zap, Shield, Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: Wifi, title: 'NFC / QR', subtitle: 'Enabled' },
  { icon: Leaf, title: 'Eco-Friendly', subtitle: '& Paperless' },
  { icon: UserCheck, title: 'Save Contact', subtitle: 'in One Tap' },
  { icon: TrendingUp, title: 'Digital Profile', subtitle: 'for a Smarter' },
];

const SmartCardBanner = () => {
  return (
    <section className="  bg-gradient-to-r
    from-[#07133d]
    via-[#0c1e4a]
    to-[#142d5a] relative w-full overflow-hidden  px-4 py-8 sm:px-6 md:px-10 lg:px-16 min-h-[80vh] lg:min-h-[85vh] xl:min-h-[90vh] lg:mt-15">
      {/* Modern Animated Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient" />

      {/* Floating Gradient Orbs */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-[400px] w-[400px] rounded-full bg-[#0B5FFF]/15 blur-[130px] animate-pulse" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-[#2F80FF]/10 blur-[150px] animate-pulse animation-delay-2000" />
      <div className="pointer-events-none absolute left-1/2 bottom-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#5FB4FF]/5 blur-[120px]" />

      {/* Animated Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-y-4 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0 items-center h-full py-4 lg:py-6 mt-10 lg:mt-0 md:mt-0">

        {/* Left Content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-3 lg:space-y-4 lg:py-6 md:py-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl lg:leading-15 tracking-tight">
            The{' '}
            <span className="bg-gradient-to-r from-[#3B9EFF] via-[#5FB4FF] to-[#8EC5FF] bg-clip-text text-transparent">
              Smart Business Card
            </span>
            <br />
            <span className="text-white/90">Designed for Professionals</span>{' '}
            <span className="bg-gradient-to-r from-[#3B9EFF] to-[#5FB4FF] bg-clip-text text-transparent">
              Connect Instantly
            </span>
          </h2>

          <p className="text-sm text-white/60 sm:text-base lg:text-lg max-w-2xl lg:max-w-full">
            Share your profile instantly, grow your network, and make every connection count with our next-generation digital business cards.
          </p>

          {/* Buttons - Desktop */}
          <div className="hidden lg:flex w-full flex-col gap-3 sm:flex-row sm:gap-4 pt-2">
            <Link
              to="/products"
              className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#337ef6] to-[#0447c2] px-10 text-sm font-semibold tracking-wider text-white shadow-[0_8px_32px_-8px_rgba(47,128,255,0.6)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_-8px_rgba(47,128,255,0.8)] active:scale-95 sm:w-auto"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700" />
            </Link>

            <Link
              to="/how-it-works"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-10 text-sm font-semibold tracking-wider text-white transition-all duration-300 hover:bg-white/10 hover:border-white/30 active:scale-95 sm:w-auto"
            >
              How It Works
            </Link>
          </div>
        </div>

        {/* Right Content - Image */}
        <div className="relative flex items-center justify-center lg:justify-end lg:py-6 md:py-6">
          <div className="pointer-events-none absolute -inset-10 bg-gradient-to-r from-[#2F80FF]/20 to-[#5FB4FF]/20 blur-3xl" />

          <div className="relative">
            <div className="relative">
              <img
                src="banner.png"
                alt="Brilson smart business card and mobile app mockup"
                className="relative z-10 w-full max-w-[320px] object-contain drop-shadow-2xl sm:max-w-[380px] md:max-w-[420px] lg:max-w-[480px] xl:max-w-[520px] 2xl:max-w-[560px]"
              />
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#3B9EFF]/20 to-[#5FB4FF]/20 blur-2xl animate-pulse" />
            </div>

            {/* Floating Feature Tags */}
            <div className="absolute -right-4 top-4 hidden rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm shadow-lg lg:block animate-float">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-xs font-medium text-white/90">Instant Share</span>
              </div>
            </div>
            <div className="absolute -left-4 bottom-20 hidden rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm shadow-lg lg:block animate-float animation-delay-1000">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-medium text-white/90">Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 pt-4 lg:pt-3">
          {FEATURES.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="group relative flex items-center gap-3 rounded-xl border border-white/10 lg:bg-white/5 md:bg-white/5 p-2.5 lg:p-3 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:border-[#3B82F6]/40 hover:bg-white/10 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex h-10 w-10 lg:h-11 lg:w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B82F6]/30 to-[#2563EB]/20 border border-[#3B82F6]/30 shadow-[0_0_20px_rgba(59,130,246,0.25)] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] group-hover:border-[#3B82F6]/50">
                <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-[#93BBFF] drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" strokeWidth={2} />
              </div>

              <div className="relative leading-tight">
                <p className="text-xs lg:text-sm font-semibold text-white lg:tracking-widest md:tracking-widest">{title}</p>
                <p className="text-[10px] lg:text-xs text-white/70 lg:tracking-wide md:tracking-wide lg:mt-1 md:mt-1">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons - Mobile */}
        <div className="lg:hidden flex w-full flex-col gap-3 sm:flex-row sm:gap-4 pt-2">
          <Link
            to="/products"
            className="group text-center relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-[#337ef6] to-[#0447c2] px-6 text-sm font-semibold text-white shadow-[0_8px_32px_-8px_rgba(47,128,255,0.6)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_-8px_rgba(47,128,255,0.8)] active:scale-95 sm:w-auto"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700" />
          </Link>

          <Link
            to="/how-it-works"
            className="flex text-center h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/30 active:scale-95 sm:w-auto"
          >
            How It Works
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SmartCardBanner;