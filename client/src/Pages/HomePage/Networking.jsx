import { Link } from "react-router-dom";
import { FiArrowRight, FiShield, FiGlobe, FiClock, FiZap } from "react-icons/fi";
import { useGetTransform } from "../../api/client-query";



const Networking = () => {

  const { data } = useGetTransform();
  const response = data?.data
  const feature = response?.features || [];

  const defaultFeatures = [
    "✓ Free Worldwide Shipping",
    "✓ 30-Day Money-Back Guarantee",
    "✓ 24/7 Support"
  ];

  const displayFeatures = feature.length > 0 ? feature : defaultFeatures;

  return (
    <section className="relative w-full bg-black overflow-hidden py-10 md:py-10">
      {/* Static background — same look, no continuous animation */}
      <div className="absolute inset-0">
        {/* Main glow gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-cyan-500/20 rounded-full blur-3xl" />

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 255, 255, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Premium Badge with glow */}
          <div>
            <span className="relative inline-block px-6 py-2 text-xs md:text-sm font-medium tracking-wider uppercase text-cyan-400 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,170,255,0.15)]">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />
              <span className="relative flex items-center gap-2 tracking-widest font-Roboto">
                <FiZap size={14} className="text-cyan-400 " />
                {response?.badgeText || "Limited Time Offer – 40% OFF"}
              </span>
            </span>
          </div>

          {/* Heading with gradient text */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-wide font-Roboto text-white">
            {response?.heading ? (
              <span dangerouslySetInnerHTML={{
                __html: response?.heading.replace(
                  /Transform/g,
                  '<span class="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Transform</span>'
                )
              }} />
            ) : (
              <>
                <span className="text-white">Ready to</span> <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Transform</span> <span className="text-white">Your</span>
                <br className="hidden sm:block" />
                <span className="inline-block mt-1">Networking?</span>
              </>
            )}
          </h2>

          {/* Sub text */}
          <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl px-4 tracking-widest font-Roboto">
            {response?.subHeading || (
              <>
                Join <span className="font-normal text-white">50,000+ professionals</span> who've already upgraded.
                <br className="hidden sm:block" />
                Get your smart card today and never run out of business cards again.
              </>
            )}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-2 w-full sm:w-auto">
            {/* Primary CTA  */}
            <Link
              to="/products"
              className="group relative inline-flex items-center justify-center px-8 sm:px-8 md:px-12 py-2 sm:py-3 rounded-full font-semibold text-white text-sm sm:text-base overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-[0_10px_40px_rgba(0,170,255,0.3)] hover:shadow-[0_15px_50px_rgba(0,170,255,0.4)]"
            >


              <span className="relative flex items-center gap-2 tracking-widest font-Roboto">
                Get Started
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>

            {/* Secondary CTA - Contact Sales */}
            <Link
              to="/contact-sale"
              className="group inline-flex items-center justify-center px-8 sm:px-8 py-2 sm:py-2 rounded-full border-2 border-blue-500/50 text-white font-medium text-sm sm:text-base bg-transparent hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 hover:scale-105 tracking-widest font-Roboto"
            >
              <span className="relative flex items-center gap-2">
                Contact Sales
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
              </span>
            </Link>
          </div>

          {/* Bottom Features */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-2 border-t border-white/5 w-full max-w-3xl tracking-widest font-Roboto">
            {displayFeatures.map((item, index) => {
              const iconMap = {
                'Free Worldwide Shipping': <FiGlobe size={14} className="text-cyan-400" />,
                '30-Day Money-Back Guarantee': <FiShield size={14} className="text-emerald-400" />,
                '24/7 Support': <FiClock size={14} className="text-blue-400" />
              };

              const icon = iconMap[item] || <FiShield size={14} className="text-cyan-400" />;

              return (
                <p
                  key={index}
                  className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm"
                >
                  {icon}
                  <span>{item}</span>
                  {index < displayFeatures.length - 1 && (
                    <span className="hidden sm:inline w-px h-4 bg-white/10 ml-1" />
                  )}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Networking;
