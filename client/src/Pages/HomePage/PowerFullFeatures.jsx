import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiGlobe,
  FiLock,
  FiRefreshCw,
  FiSmartphone,
  FiZap,
  FiKey,
  FiLayout,
  FiArrowRight,
  FiWifi,
  FiDownload,
  FiCheck,
  FiHome,
  FiUser,
  FiSettings,
  FiShield,
} from "react-icons/fi";
// API call no longer used — feature data is now hardcoded below.
// import { useGetFeatures } from "../../api/client-query";

/* ------------------------------------------------------------------ */
/* Per-feature CSS-only visuals (no images). Each one is matched by   */
/* array position to FEATURES_DATA below, in the SAME order:          */
/*   0 Analytics Dashboard  1 Global Reach       2 Secure & Private   */
/*   3 Always Updated       4 Mobile Friendly    5 NFC Technology     */
/*   6 QR Code Backup       7 Custom Designs                          */
/* ------------------------------------------------------------------ */

const AnalyticsVisual = ({ style }) => (
  <div
    className={`relative w-full h-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent ${style.accent}`}
  >
    {/* Glow */}
    <div
      className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-30"
      style={{ background: style.glow }}
    />

    {/* Header */}
    <div className="relative flex items-start justify-between px-3 pt-2.5">
      <div>
        <div className="flex items-center gap-1.5">
          {/* Analytics Icon */}
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center bg-white/10"
            style={{
              boxShadow: `0 0 10px ${style.glow}`,
            }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-white/80"
            >
              <path d="M3 3v18h18" />
              <path d="m7 16 4-5 3 3 5-7" />
            </svg>
          </div>

          <span className="text-[8px] font-medium text-white/50">
            Analytics
          </span>
        </div>

        <div className="mt-1">
          <span className="text-[8px] text-white/40 block leading-none">
            Profile Views
          </span>

          <span className="text-[17px] font-bold tracking-tight text-white leading-tight">
            12.4K
          </span>
        </div>
      </div>

      {/* Growth Badge */}
      <div className="flex items-center gap-0.5 px-1.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-emerald-400"
        >
          <path d="m5 12 5 5L20 7" />
        </svg>

        <span className="text-[7px] font-bold text-emerald-400">
          32%
        </span>
      </div>
    </div>

    {/* Chart */}
    <div className="relative px-3 mt-2">
      {/* Horizontal Grid */}
      <div className="absolute inset-x-3 top-0 h-10 flex flex-col justify-between opacity-20 pointer-events-none">
        <span className="border-t border-white/20" />
        <span className="border-t border-white/20" />
        <span className="border-t border-white/20" />
      </div>

      {/* Bars */}
      <div className="relative flex items-end justify-between gap-1 h-10">
        {[35, 48, 42, 65, 58, 78, 70, 92].map((height, i) => (
          <div
            key={i}
            className="relative flex-1 max-w-[12px] rounded-t-[3px] overflow-hidden"
            style={{
              height: `${height}%`,
              background:
                i === 7
                  ? style.glow
                  : `linear-gradient(to top, ${style.glow}, rgba(255,255,255,0.12))`,
              opacity: 0.45 + i * 0.07,
              boxShadow:
                i === 7
                  ? `0 0 10px ${style.glow}`
                  : `0 0 4px ${style.glow}`,
            }}
          >
            {/* Shine */}
            <span className="absolute inset-x-0 top-0 h-[2px] bg-white/50" />
          </div>
        ))}
      </div>

      {/* Bottom labels */}
      <div className="flex justify-between mt-1.5">
        <span className="text-[6px] text-white/25">Mon</span>
        <span className="text-[6px] text-white/25">Tue</span>
        <span className="text-[6px] text-white/25">Wed</span>
        <span className="text-[6px] text-white/25">Thu</span>
        <span className="text-[6px] text-white/25">Fri</span>
        <span className="text-[6px] text-white/25">Sat</span>
        <span className="text-[6px] text-white/40">Sun</span>
      </div>
    </div>

    {/* Bottom Status */}
    <div className="flex items-center justify-between px-3 mt-1.5 pb-2">
      <span className="text-[7px] text-white/35">
        Last 7 days
      </span>

      <div className="flex items-center gap-1">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{
            background: style.glow,
            boxShadow: `0 0 6px ${style.glow}`,
          }}
        />

        <span className="text-[7px] font-medium text-white/50">
          Live
        </span>
      </div>
    </div>
  </div>
);


const GlobeVisual = ({ style }) => (
  <div
    className={`relative w-full h-full flex items-center justify-center overflow-hidden ${style.accent}`}
  >
    {/* Background glow */}
    <div
      className="absolute w-32 h-32 rounded-full blur-3xl opacity-20"
      style={{ background: style.glow }}
    />

    {/* Globe wrapper */}
    <div className="relative w-[70%] h-[70%] aspect-square">
      
      {/* Outer glowing ring */}
      <div
        className="absolute -inset-[10%] rounded-full border border-current opacity-20"
        style={{
          boxShadow: `0 0 20px ${style.glow}`,
        }}
      />

      {/* Main Globe */}
      <div
        className="absolute inset-0 rounded-full border border-current/50"
        style={{
          background: `
            radial-gradient(
              circle at 35% 30%,
              rgba(255,255,255,0.16),
              rgba(255,255,255,0.04) 35%,
              rgba(0,0,0,0.25) 100%
            )
          `,
          boxShadow: `
            inset -12px -10px 25px rgba(0,0,0,0.45),
            inset 5px 5px 15px rgba(255,255,255,0.08),
            0 0 25px ${style.glow}
          `,
        }}
      >

        {/* Latitude 1 */}
        <div
          className="absolute left-[-12%] right-[-12%] top-[25%] h-[45%] rounded-[50%] border border-current opacity-25"
        />

        {/* Latitude 2 */}
        <div
          className="absolute left-[-8%] right-[-8%] top-[38%] h-[25%] rounded-[50%] border border-current opacity-30"
        />

        {/* Longitude 1 */}
        <div
          className="absolute top-[-10%] bottom-[-10%] left-[28%] w-[45%] rounded-[50%] border border-current opacity-25"
          style={{
            transform: "rotate(18deg)",
          }}
        />

        {/* Longitude 2 */}
        <div
          className="absolute top-[-10%] bottom-[-10%] left-[28%] w-[45%] rounded-[50%] border border-current opacity-20"
          style={{
            transform: "rotate(-18deg)",
          }}
        />

        {/* Center longitude */}
        <div
          className="absolute top-[-5%] bottom-[-5%] left-1/2 w-[35%] -translate-x-1/2 rounded-full border border-current opacity-15"
        />

        {/* Location points */}

        {/* Point 1 */}
        <span
          className="absolute top-[22%] left-[30%] w-1.5 h-1.5 rounded-full bg-current"
          style={{
            boxShadow: `0 0 8px ${style.glow}`,
          }}
        />

        {/* Point 2 */}
        <span
          className="absolute top-[40%] right-[20%] w-1.5 h-1.5 rounded-full bg-current"
          style={{
            boxShadow: `0 0 8px ${style.glow}`,
          }}
        />

        {/* Point 3 */}
        <span
          className="absolute bottom-[25%] left-[22%] w-1.5 h-1.5 rounded-full bg-current"
          style={{
            boxShadow: `0 0 8px ${style.glow}`,
          }}
        />

        {/* Point 4 */}
        <span
          className="absolute bottom-[32%] right-[30%] w-1 h-1 rounded-full bg-current opacity-70"
          style={{
            boxShadow: `0 0 6px ${style.glow}`,
          }}
        />

        {/* Center active location */}
        <span
          className="absolute top-[48%] left-[54%] w-2 h-2 rounded-full bg-current"
          style={{
            boxShadow: `
              0 0 0 3px rgba(255,255,255,0.05),
              0 0 12px ${style.glow}
            `,
          }}
        />

        {/* Shine */}
        <div
          className="absolute top-[10%] left-[18%] w-[25%] h-[15%] rounded-full bg-white/10 blur-md"
          style={{
            transform: "rotate(-25deg)",
          }}
        />
      </div>

      {/* Orbit ring */}
      <div
        className="absolute -inset-[18%] rounded-full border border-current opacity-15"
        style={{
          transform: "rotate(-25deg) scaleY(0.42)",
        }}
      />

      {/* Orbit dot */}
      <span
        className="absolute -top-[4%] left-[62%] w-1.5 h-1.5 rounded-full bg-current"
        style={{
          boxShadow: `0 0 10px ${style.glow}`,
        }}
      />
    </div>

    {/* Small label */}
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/[0.05] border border-white/10">
        <span
          className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"
          style={{
            boxShadow: `0 0 6px ${style.glow}`,
          }}
        />

        <span className="text-[7px] font-medium text-white/45">
          Global Reach
        </span>
      </div>
    </div>
  </div>
);



const ShieldVisual = ({ style }) => {
  const Icon = style.icon;

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center ${style.accent}`}
    >
      <div
        className="relative w-[58%] h-[76%] flex items-center justify-center"
        style={{
          clipPath:
            "polygon(50% 0%, 90% 14%, 85% 70%, 50% 100%, 15% 70%, 10% 14%)",

          background: `
            linear-gradient(
              145deg,
              rgba(255,255,255,0.16),
              rgba(255,255,255,0.03)
            ),
            ${style.glow}
          `,

          boxShadow: `
            0 0 25px ${style.glow},
            inset 0 0 25px rgba(255,255,255,0.08)
          `,

          filter: `drop-shadow(0 0 12px ${style.glow})`,
        }}
      >
        {/* Inner shield */}
        <div
          className="absolute inset-[3px] flex items-center justify-center"
          style={{
            clipPath:
              "polygon(50% 0%, 90% 14%, 85% 70%, 50% 100%, 15% 70%, 10% 14%)",
            background: "rgba(2, 20, 30, 0.55)",
          }}
        >
          <Icon
            className="w-8 h-8 text-white"
            strokeWidth={1.8}
            style={{
              filter: `drop-shadow(0 0 8px ${style.glow})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};



const UpdatedVisual = ({ style }) => (
  <div
    className={`relative w-full h-full flex items-center justify-center ${style.accent}`}
  >
    {/* Phone */}
    <div
      className="relative w-[72px] h-[128px] rounded-[14px] border border-current/50 bg-slate-950/80 p-[4px]"
      style={{
        boxShadow: `
          0 0 20px ${style.glow},
          0 12px 25px rgba(0,0,0,0.4)
        `,
      }}
    >
      {/* Screen */}
      <div className="relative w-full h-full rounded-[10px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] overflow-hidden flex flex-col items-center justify-center">
        
        {/* Camera */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-1 rounded-full bg-black/70" />

        {/* Update Icon */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center border border-current/40 bg-current/10"
          style={{
            boxShadow: `0 0 14px ${style.glow}`,
          }}
        >
          <FiRefreshCw
            className="w-5 h-5 animate-spin"
            style={{ animationDuration: "3.5s" }}
          />
        </div>

        <span className="mt-2 text-[7px] font-semibold text-white/80">
          Updating
        </span>

        {/* Progress */}
        <div className="mt-2 w-10 h-[3px] rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full w-[75%] rounded-full bg-current"
            style={{
              boxShadow: `0 0 8px ${style.glow}`,
            }}
          />
        </div>

        <span className="mt-1 text-[5px] text-white/40">
          75%
        </span>
      </div>
    </div>

    {/* Floating update elements */}

    <div
      className="absolute top-[28%] left-[15%] w-6 h-6 rounded-lg border border-current/30 bg-white/[0.04] flex items-center justify-center"
      style={{ boxShadow: `0 0 12px ${style.glow}` }}
    >
      <FiDownload className="w-3 h-3" />

    </div>

    <div
      className="absolute top-[18%] right-[12%] w-5 h-5 rounded-full border border-current/30 bg-white/[0.04] flex items-center justify-center"
    >
      <FiCheck className="w-3 h-3" />
    </div>

    <div
      className="absolute bottom-[25%] right-[8%] px-2 py-1 rounded-full border border-white/10 bg-white/5"
    >
      <span className="text-[6px] font-semibold text-white/70">
        OTA Update
      </span>
    </div>
  </div>
);


const MobileVisual = ({ style }) => (
  <div
    className={`relative w-full h-full flex items-center justify-center overflow-visible ${style.accent}`}
  >
    {/* Phone */}
    <div
      className="relative z-20 w-[82px] h-[180px] shrink-0 rounded-[18px] border-2 border-current/50 bg-slate-950 p-[4px]"
      style={{
        boxShadow: `
          0 0 22px ${style.glow},
          0 12px 30px rgba(0,0,0,0.45)
        `,
      }}
    >
      {/* Screen */}
      <div className="relative w-full h-full overflow-hidden rounded-[13px] bg-gradient-to-b from-white/[0.08] to-white/[0.02]">

        {/* Notch */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-7 h-1.5 rounded-full bg-black/80" />

        {/* Profile */}
        <div className="flex flex-col items-center pt-6">

          <div
            className="w-9 h-9 rounded-full bg-current/20 border border-current/30 flex items-center justify-center"
            style={{
              boxShadow: `0 0 10px ${style.glow}`,
            }}
          >
            <FiUser className="w-4 h-4" />
          </div>

          <span className="mt-1 text-[7px] font-bold text-white/90">
            Your Profile
          </span>

          <span className="text-[5px] text-white/40">
            Brilson Card
          </span>
        </div>

        {/* NFC Card */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[30px] w-[60px] h-[42px] rounded-lg border border-current/30 bg-current/10 p-2"
          style={{
            boxShadow: `0 0 14px ${style.glow}`,
          }}
        >
          <div className="flex items-center gap-1">
            <FiWifi className="w-3 h-3 rotate-90" />

            <span className="text-[6px] font-semibold text-white/70">
              NFC
            </span>
          </div>

          <div className="mt-2 w-full h-1 rounded-full bg-white/10">
            <div className="w-[70%] h-full rounded-full bg-current opacity-70" />
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3 text-white/30">
          <FiHome className="w-2.5 h-2.5" />

          <FiUser className="w-2.5 h-2.5 text-current" />

          <FiSettings className="w-2.5 h-2.5" />
        </div>
      </div>
    </div>

    {/* NFC Signal - Left */}
    <div
      className="absolute left-[8%] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-current/30 flex items-center justify-center"
      style={{
        boxShadow: `0 0 12px ${style.glow}`,
      }}
    >
      <FiWifi
        className="w-3.5 h-3.5 rotate-90"
        style={{
          filter: `drop-shadow(0 0 5px ${style.glow})`,
        }}
      />
    </div>

    {/* NFC waves */}
    <div className="absolute left-[3%] top-1/2 -translate-y-1/2 flex gap-1">
      <span className="w-1 h-4 rounded-full bg-current opacity-30" />
      <span className="w-1 h-6 rounded-full bg-current opacity-20" />
    </div>

    {/* Connected */}
    <div
      className="absolute right-[5%] top-[24%] flex items-center gap-1 px-2 py-1 rounded-full border border-white/10 bg-white/[0.05] "
      style={{
        boxShadow: `0 0 10px ${style.glow}`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />

      <span className="text-[6px] text-white/60 whitespace-nowrap">
        Connected
      </span>
    </div>

    {/* Profile Connected */}
    <div className="absolute right-[3%] bottom-[25%] px-2 py-1 rounded-md border border-white/10 bg-white/[0.04]">
      <span className="text-[5px] text-white/50 whitespace-nowrap">
        NFC Profile
      </span>
    </div>
  </div>
);


const NfcVisual = ({ style }) => (
  <div
    className={`relative w-full h-full flex items-center justify-center ${style.accent}`}
  >

    {/* Main NFC Card */}
    <div
      className="relative z-10 w-[125px] h-[78px] rounded-2xl border border-current/40 bg-white/[0.05] p-2">
    

      {/* Top */}
      <div className="relative flex items-center justify-between">
        <span className="text-[8px] font-bold tracking-[0.18em] text-white/90">
          BRILSON
        </span>

        <FiWifi
          className="w-5 h-5 rotate-90"
          style={{
            filter: `drop-shadow(0 0 7px ${style.glow})`,
          }}
        />
      </div>

      {/* Card line */}
      <div className="relative mt-3 w-full h-[1px] bg-white/10" />

      {/* Bottom info */}
      <div className="relative mt-2 flex items-center justify-between">
        <span className="text-[6px] text-white/40">
          DIGITAL CARD
        </span>
        <span className="text-[10px] text-yellow-300 font-extrabold ">
          NFC
        </span>
      </div>
    </div>
  </div>
);


const QR_PATTERN = [
  1, 1, 1, 0, 1,
  1, 0, 1, 0, 0,
  1, 1, 1, 0, 1,
  0, 0, 0, 1, 1,
  1, 0, 1, 1, 0,
];

const QrVisual = ({ style }) => (
  <div
    className={`relative w-full h-full flex items-center justify-center overflow-hidden ${style.accent}`}
  >
    {/* Background Glow */}
    <div
      className="absolute w-28 h-28 rounded-full blur-3xl opacity-20"
      style={{
        background: style.glow,
      }}
    />

    {/* QR Visual Wrapper */}
    <div className="relative w-[108px] h-[108px]">

      {/* Outer Backup Ring */}
      <div
        className="absolute -inset-[10%] rounded-full border border-current opacity-15"
        style={{
          boxShadow: `0 0 18px ${style.glow}`,
        }}
      />

      {/* Rotated Scan Ring */}
      <div
        className="absolute -inset-[5%] rounded-full border border-current opacity-20"
        style={{
          transform: "rotate(-25deg) scaleY(0.42)",
        }}
      />

      {/* QR Container */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] rounded-xl bg-white p-[6px]"
        style={{
          boxShadow: `
            0 0 20px ${style.glow},
            0 0 35px rgba(255,255,255,0.08)
          `,
        }}
      >
        {/* QR Pattern */}
        <div className="grid grid-cols-5 gap-[2px] w-full h-full">
          {QR_PATTERN.map((on, i) => (
            <span
              key={i}
              className={`rounded-[1px] ${
                on ? "bg-slate-950" : "bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Top Left Scan Corner */}
      <div
        className="absolute top-[13px] left-[13px] w-5 h-5 border-l-2 border-t-2 rounded-tl-md"
        style={{
          filter: `drop-shadow(0 0 5px ${style.glow})`,
        }}
      />

      {/* Top Right Scan Corner */}
      <div
        className="absolute top-[13px] right-[13px] w-5 h-5 border-r-2 border-t-2 rounded-tr-md"
        style={{
          filter: `drop-shadow(0 0 5px ${style.glow})`,
        }}
      />

      {/* Bottom Left Scan Corner */}
      <div
        className="absolute bottom-[13px] left-[13px] w-5 h-5 border-l-2 border-b-2 rounded-bl-md"
        style={{
          filter: `drop-shadow(0 0 5px ${style.glow})`,
        }}
      />

      {/* Bottom Right Scan Corner */}
      <div
        className="absolute bottom-[13px] right-[13px] w-5 h-5 border-r-2 border-b-2 rounded-br-md"
        style={{
          filter: `drop-shadow(0 0 5px ${style.glow})`,
        }}
      />

      {/* Orbit Dot */}
      <span
        className="absolute -top-[3px] left-[62%] w-1.5 h-1.5 rounded-full bg-current"
        style={{
          boxShadow: `0 0 10px ${style.glow}`,
        }}
      />

      {/* Small Backup Dot */}
      <span
        className="absolute bottom-[12px] -right-[3px] w-1 h-1 rounded-full bg-current opacity-70"
        style={{
          boxShadow: `0 0 7px ${style.glow}`,
        }}
      />
    </div>

    



    {/* Saved Status */}
    <div className="absolute bottom-[9%] left-1/2 -translate-x-1/2">
   
    </div>
  </div>
);



const CustomDesignsVisual = ({ style }) => (
  <div
    className={`relative w-full h-full flex items-center justify-center overflow-hidden  ${style.accent}`}
  >
    {/* Background Glow */}
    <div
      className="absolute w-32 h-32 rounded-full blur-3xl opacity-20"
      style={{
        background: style.glow,
      }}
    />

    {/* Design Stage */}
    <div className="relative w-[120px] h-[105px] ">

      {/* Outer Design Ring */}
      <div
        className="absolute inset-[8%] rounded-full border border-current opacity-10 "
        style={{
          boxShadow: `0 0 25px ${style.glow}`,
        }}
      />

      {/* Back Card - Purple */}
      <div
        className="absolute lg:left-[18px] md:left-[18px] left-[12px] top-[18px] w-[76px] h-[48px] rounded-xl border border-fuchsia-300/20 bg-gradient-to-br from-fuchsia-500/80 to-purple-700/80"
        style={{
          transform: "rotate(-18deg)",
          boxShadow: `0 0 18px rgba(168,85,247,0.25)`,
        }}
      >
        <div className="absolute left-2 top-2 w-4 h-1 rounded-full bg-white/30" />
        <div className="absolute right-2 bottom-2 w-5 h-5 rounded-full border border-white/20" />
      </div>

      {/* Back Card - Blue */}
      <div
        className="absolute lg:left-[20px] md:left-[20px] left-[16px] top-[16px] w-[76px] h-[48px] rounded-xl border border-sky-300/20 bg-gradient-to-br from-sky-400/80 to-blue-700/80"
        style={{
          transform: "rotate(-8deg)",
          boxShadow: `0 0 18px rgba(59,130,246,0.25)`,
        }}
      >
        <div className="absolute left-2 top-2 w-4 h-1 rounded-full bg-white/30" />
        <div className="absolute bottom-2 left-2 right-2 h-[3px] rounded-full bg-white/20" />
      </div>

      {/* Main Custom Card */}
      <div
        className="absolute lf:left-[24px] md:left-[24px] left-[20px] top-[14px] w-[76px] h-[48px] rounded-xl border border-white/20 bg-slate-900/95 overflow-hidden"
        style={{
          transform: "rotate(8deg)",
          boxShadow: `
            0 0 22px ${style.glow},
            0 12px 25px rgba(0,0,0,0.45),
            inset 0 0 18px rgba(255,255,255,0.04)
          `,
        }}
      >
        {/* Card Accent */}
        <div
          className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-40"
          style={{
            background: style.glow,
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center justify-between px-3 pt-2">
          <span className="text-[7px] font-black tracking-[0.18em] text-white">
            BRILSON
          </span>

          <div className="w-3 h-3 rounded-full border border-white/30 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-current" />
          </div>
        </div>

        {/* Custom Design Lines */}
        <div className="relative mt-3 px-3 space-y-1">
          <div className="w-10 h-[3px] rounded-full bg-white/40" />
          <div className="w-7 h-[2px] rounded-full bg-white/15" />
        </div>

        {/* Card Chip */}
        <div className="absolute bottom-2 left-3 w-4 h-3 rounded-[3px] border border-white/20 bg-white/10">
          <div className="w-full h-full grid grid-cols-2 opacity-50">
            <span className="border-r border-white/20" />
            <span />
          </div>
        </div>
      </div>

      {/* Floating Color / Design Nodes */}

     

      <div className="absolute bottom-[14px] left-[3px] w-5 h-5 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center">
        <div className="w-2 h-2 rounded-sm border border-current rotate-45" />
      </div>

      {/* Small Decorative Dots */}
      <span
        className="absolute top-[35px] left-[4px] w-1.5 h-1.5 rounded-full bg-current"
        style={{ boxShadow: `0 0 8px ${style.glow}` }}
      />

      <span
        className="absolute bottom-[8px] right-[13px] w-1 h-1 rounded-full bg-current opacity-60"
      />
    </div>
  
  </div>
);




// Order matches FEATURES_DATA exactly — no cycling/modulo, index-to-index mapping.
const visualVariants = [
  NfcVisual,         // 5 NFC Technology
  QrVisual,          // 6 QR Code Backup
  CustomDesignsVisual, // 7 Custom Designs
  AnalyticsVisual,   // 0 Analytics Dashboard
  GlobeVisual,       // 1 Global Reach
  ShieldVisual,      // 2 Secure & Private
  MobileVisual,      // 4 Mobile Friendly
  UpdatedVisual,     // 3 Always Updated
];

// Hardcoded feature data — replaces the previous /api/admin/powerfull/features call.
// Order kept exactly as before. Edit title/description here to update content.
const SUB_HEADING =
  "Everything you need to network smarter, all built into one smart card.";

const FEATURES_DATA = [
  {
    title: "NFC Technology",
    description:
      "Instant sharing with a simple tap. Compatible with all modern smartphones.",
    },
    {
      title: "QR Code Backup",
      description:
      "Universal compatibility. Works even without NFC-enabled devices.",
    },
    {
      title: "Custom Designs",
      description:
        "Personalize your card with unique designs, styles, colors and layouts.",
    },
  {
    title: "Analytics Dashboard",
    description:
      "Track profile views, link clicks and valuable connection insights.",
  },
  {
    title: "Global Reach",
    description:
      "Works worldwide. No app required for recipients to view your profile.",
  },
  {
    title: "Secure & Private",
    description:
      "Your data stays encrypted. You're always in control of what you share.",
  },
  {
    title: "Mobile Friendly",
    description:
      "Manage everything directly from your phone. iOS & Android supported.",
  },
  {
    title: "Always Updated",
    description:
    "Update your digital profile anytime — no need for new printed cards.",
  },
];

const PowerFullFeatures = () => {

  // Previously fetched from the backend:
  // const { data } = useGetFeatures();
  // const feature = data?.data?.features || [];
  // const subHeading = data?.data?.subHeading || "";

  const feature = FEATURES_DATA;
  const subHeading = SUB_HEADING;

  // Each style pairs a border/glow color with a small badge icon,
  // mirroring the accent-per-feature treatment from the reference cards.
  const colorStyles = [
    {
      border: "from-yellow-400 via-orange-400 to-yellow-500",
      glow: "rgba(255, 190, 0, 0.5)",
      accent: "text-yellow-400",
      badgeShadow: "rgba(255, 190, 0, 0.55)",
      icon: FiZap,
    },
    {
      border: "from-purple-500 via-violet-500 to-purple-400",
      glow: "rgba(150, 60, 255, 0.45)",
      accent: "text-purple-400",
      badgeShadow: "rgba(150, 60, 255, 0.5)",
      icon: FiGlobe,
    },
    {
      border: "from-blue-500 via-cyan-500 to-blue-400",
      glow: "rgba(0, 180, 255, 0.45)",
      accent: "text-cyan-400",
      badgeShadow: "rgba(0, 180, 255, 0.5)",
      icon: FiBarChart2,
    },
    {
      border: "from-sky-500 via-blue-500 to-cyan-400",
      glow: "rgba(0, 150, 255, 0.45)",
      accent: "text-sky-400",
      badgeShadow: "rgba(0, 150, 255, 0.5)",
      icon: FiSmartphone,
    },
     {
      border: "from-pink-500 via-rose-500 to-pink-400",
      glow: "rgba(255, 0, 120, 0.45)",
      accent: "text-pink-400",
      badgeShadow: "rgba(255, 0, 120, 0.5)",
      icon: FiKey,
    },
    {
      border: "from-teal-400 via-emerald-400 to-green-500",
      glow: "rgba(0, 255, 150, 0.45)",
      accent: "text-emerald-400",
      badgeShadow: "rgba(0, 255, 150, 0.5)",
      icon: FiLock,
    },
    {
      border: "from-green-400 via-lime-400 to-green-500",
      glow: "rgba(140, 255, 0, 0.45)",
      accent: "text-lime-400",
      badgeShadow: "rgba(140, 255, 0, 0.5)",
      icon: FiRefreshCw,
    },
    {
      border: "from-violet-500 via-purple-500 to-indigo-400",
      glow: "rgba(150, 60, 255, 0.45)",
      accent: "text-violet-400",
      badgeShadow: "rgba(150, 60, 255, 0.5)",
      icon: FiLayout,
    },
  ];

  // Single orchestrated reveal sequence — cards stagger in once, no per-card scroll triggers.
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 26, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // Split a two-word title so the second word can carry the accent color,
  // matching "Analytics Dashboard" / "Global Reach" style headings.
  const splitTitle = (title = "") => {
    const words = title.trim().split(" ");
    if (words.length < 2) return { first: title, rest: "" };
    return { first: words[0], rest: words.slice(1).join(" ") };
  };

  return (
    <section className="relative w-full lg:py-20 py-12 text-white overflow-hidden bg-black">
      {/* Animated gradient backdrop */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-black via-[#0a0a0c] to-black bg-[length:200%_200%]"
      />

      {/* Soft radial glow accents, drifting slowly */}
      <motion.div
        className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-cyan-500/[0.06]"
       
      />
      <motion.div
        className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-indigo-500/[0.06]"
        
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl md:text-5xl font-semibold mt-6 tracking-widest font-Roboto"
        >
          Powerful <span className="text-yellow-400">Features</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-center text-gray-300 mt-4 max-w-2xl mx-auto text-md tracking-widest font-Roboto"
        >
          {subHeading}
        </motion.p>

        {/* Feature cards  */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 tracking-widest font-Roboto"
        >
          {feature.map((item, index) => {
            const style = colorStyles[index % colorStyles.length];
            const Icon = style.icon;
            const { first, rest } = splitTitle(item.title);
            const Visual = visualVariants[index % visualVariants.length];

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
                className="relative rounded-[26px] p-[1.5px] h-full cursor-pointer"
                style={{
                  boxShadow: `0 30px 60px -18px ${style.glow}, 0 10px 28px -8px rgba(0,0,0,0.6)`,
                }}
              >
                {/* Gradient border */}
                <div
                  className={`absolute inset-0 rounded-[26px] bg-gradient-to-br ${style.border} opacity-80`}
                ></div>

                {/* Card body */}
                <div className="relative flex h-full px-6 pb-7 pt-3 rounded-[25px] bg-[#0b0b0d] overflow-hidden">
                  {/* Ambient inner glow */}
                  <div
                    className="absolute inset-0 rounded-[25px] pointer-events-none opacity-30"
                    style={{ boxShadow: `inset 0 0 40px ${style.glow}` }}
                  ></div>



{/* Text content */}
<div className="relative z-10 flex flex-col flex-1 mt-2 w-[55%]">
{/* Icon badge, overlapping the image bottom-left like a floating chip */}
                    <div
                      className="w-12 h-12 flex items-center justify-center rounded-full border m-2 mb-3 border-white/10 bg-[#0b0b0d]"
                      style={{ boxShadow: `0 0 20px ${style.badgeShadow}, inset 0 0 10px ${style.glow}` }}
                    >
                      <Icon className={`w-5 h-5 ${style.accent}`} />
                    </div>
                    <h3 className="text-xl font-semibold leading-snug text-white">
                      {first} {rest && <span className={style.accent}>{rest}</span>}
                    </h3>

                    <p className="text-gray-300/90 text-sm mt-3 leading-relaxed flex-1">
                      {item.description}
                    </p>

                    <button
                      type="button"
                      className="group mt-6 inline-flex items-center gap-3 self-start text-sm font-medium text-white/90 hover:text-white transition-colors cursor-pointer"
                    >
                      Know More
                      <span
                        className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 group-hover:translate-x-0.5 transition-transform"
                        style={{ boxShadow: `0 0 14px ${style.badgeShadow}` }}
                      >
                        <FiArrowRight className="w-4 h-4" />
                      </span>
                    </button>
                  </div>



                  {/* Premium visual showcase  */}
                  <div className="relative z-10 lg:w-[45%] md:w-[45%] w-[35%] h-[100%] flex items-center justify-center rounded-2xl">
                    <div
                      className="absolute inset-0 rounded-2xl blur-2xl opacity-60"
                      style={{ background: style.glow }}
                    ></div>
                    <div className="relative lg:w-[120px] lg:h-[125px] md:w-[120px] md:h-[125px] w-[100px] h-[125px] rounded-2xl overflow-hidden bg-white/[0.02]">
                      <Visual style={style} />
                    </div>

                    
                  </div>

                  
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default PowerFullFeatures;
