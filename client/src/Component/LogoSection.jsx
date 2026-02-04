import React from 'react';

const LogoSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-8">
      {/* Modern Logo Designs */}
      <div className="max-w-6xl w-full space-y-16">
        
        {/* Main Premium Logo */}
        <div className="text-center mb-20">
          <div className="relative inline-block">
            {/* Background Glow Effect */}
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            
            {/* Logo Container */}
            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-12 border border-gray-800/50 shadow-2xl">
              
              {/* Logo with Gradient Animation */}
              <div className="flex items-center justify-center gap-4">
                {/* Icon/Symbol */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-70"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <div className="text-3xl font-bold text-white">B</div>
                  </div>
                </div>
                
                {/* Text Logo */}
                <div className="text-left">
                  <h1 className="text-6xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                      Brilson
                    </span>
                  </h1>
                  <p className="text-gray-400 text-lg mt-2 tracking-wide">Innovate. Create. Elevate.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Font Showcase Section */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Option 1: Modern Sans-Serif */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/30 hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">A</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Poppins</h3>
                <p className="text-gray-400 text-sm">Modern Geometric</p>
              </div>
              <div className="text-4xl font-Poppins font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Brilson
              </div>
            </div>
          </div>

          {/* Option 2: Elegant Serif */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/30 hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-serif">B</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Playfair Display</h3>
                <p className="text-gray-400 text-sm">Elegant & Classic</p>
              </div>
              <div className="text-4xl font-Playfair font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Brilson
              </div>
            </div>
          </div>

          {/* Option 3: Tech Mono */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/30 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-mono">C</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Space Grotesk</h3>
                <p className="text-gray-400 text-sm">Tech & Modern</p>
              </div>
              <div className="text-4xl font-SpaceGrotesk font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                Brilson
              </div>
            </div>
          </div>

        </div>

        {/* Logo Variations */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Premium Logo Variations</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Variation 1: Minimal */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Brilson
                </span>
              </div>
            </div>

            {/* Variation 2: Icon + Text */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Brilson
                </span>
              </div>
            </div>

            {/* Variation 3: Wordmark */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800 flex items-center justify-center">
              <span className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
                BRILSON
              </span>
            </div>

            {/* Variation 4: Lettermark */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800">
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">B</span>
                </div>
                <span className="text-sm text-gray-400">Brilson Inc.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Font Pairing Examples */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Font Pairing Suggestions</h2>
          
          <div className="space-y-12">
            
            {/* Pairing 1: Modern & Clean */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-3xl p-10 border border-gray-800/50">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Brilson
                  </h3>
                  <p className="text-gray-300 text-lg">
                    Using <span className="text-blue-400 font-semibold">Poppins</span> for headings with <span className="text-gray-400">Inter</span> for body text creates a clean, modern, and highly readable combination perfect for tech companies.
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Aa
                  </div>
                  <div className="mt-4">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                    <div className="h-1 bg-gray-700 rounded-full mt-1"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pairing 2: Elegant & Professional */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-3xl p-10 border border-gray-800/50">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Brilson
                  </h3>
                  <p className="text-gray-300 text-lg">
                    <span className="text-purple-400 font-serif font-semibold">Playfair Display</span> paired with <span className="text-gray-400">Lato</span> creates an elegant, sophisticated look ideal for premium brands and creative agencies.
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block text-6xl font-serif font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Bb
                  </div>
                  <div className="mt-4">
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <div className="h-1 bg-gray-700 rounded-full mt-1"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* CSS for custom fonts and animations */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        .font-Poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        .font-Playfair {
          font-family: 'Playfair Display', serif;
        }
        
        .font-SpaceGrotesk {
          font-family: 'Space Grotesk', sans-serif;
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

// Component for Sparkles icon
const Sparkles = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export default LogoSection;