import React, { useState } from 'react'
import { Trophy, Award } from 'lucide-react'

/* Flawless Seamless 3D Golden Ribbon Name Tag */
const ElegantGoldRibbon = ({ name }) => (
  <div className="relative inline-block my-0.5 z-20 filter drop-shadow-md select-none max-w-full">
    <svg
      className="w-56 md:w-64 h-11 overflow-visible"
      viewBox="0 0 280 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Rich Gold Gradient */}
        <linearGradient id="gold-ribbon-front" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="25%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="75%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>

        <linearGradient id="gold-tail-left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="gold-tail-right" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Left Ribbon Tail (Behind Front Banner) */}
      <path d="M40 14 L10 14 L22 26 L10 38 L40 38 Z" fill="url(#gold-tail-left)" stroke="#92400E" strokeWidth="0.5" />

      {/* Right Ribbon Tail (Behind Front Banner) */}
      <path d="M240 14 L270 14 L258 26 L270 38 L240 38 Z" fill="url(#gold-tail-right)" stroke="#92400E" strokeWidth="0.5" />

      {/* Left Fold Shadow Triangle */}
      <path d="M40 34 L40 41 L26 34 Z" fill="#78350F" />

      {/* Right Fold Shadow Triangle */}
      <path d="M240 34 L240 41 L254 34 Z" fill="#78350F" />

      {/* Main Center Front Banner Bar */}
      <rect
        x="36"
        y="6"
        width="208"
        height="28"
        rx="3"
        fill="url(#gold-ribbon-front)"
        stroke="#FCD34D"
        strokeWidth="1.5"
      />
    </svg>

    {/* Overlayed Name Text centered on the Front Banner Bar */}
    <div className="absolute inset-0 flex items-center justify-center pb-2.5 px-8">
      <span className="text-slate-950 font-black text-sm md:text-base tracking-wide truncate drop-shadow-2xs">
        {name}
      </span>
    </div>
  </div>
)

export default function EmployeeOfTheMonthCard({
  name = 'Rahul Sharma',
  role = 'Senior Developer',
  month = 'April 2024',
  src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  onViewAll,
  className = '',
}) {
  const [imgErr, setImgErr] = useState(false)
  const defaultPhoto = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-4.5 sm:p-5 shadow-sm text-center transition-all hover:shadow-md ${className}`}>
      {/* Top Hairline Gold Accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 shadow-2xs">
            <Trophy className="h-3.5 w-3.5 text-amber-600" />
          </span>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Employee of the Month
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[10px] font-bold tracking-wider uppercase border border-amber-200/80 shadow-2xs">
          ★ Spotlight
        </span>
      </div>

      {/* Center Profile Image with Gold Ring Frame & Star Badge */}
      <div className="relative inline-block my-1 z-10">
        <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-sm">
          <div className="p-0.5 bg-white rounded-full">
            <div className="h-22 w-22 md:h-24 md:w-24 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
              <img
                src={imgErr || !src ? defaultPhoto : src}
                alt={name}
                onError={() => setImgErr(true)}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Pinned Star Badge */}
        <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 font-bold text-[11px] shadow-sm border-2 border-white">
          ★
        </span>
      </div>

      {/* Seamless 3D Golden Ribbon Name Tag Banner */}
      <div className="-mt-4 relative z-20 flex justify-center">
        <ElegantGoldRibbon name={name} />
      </div>

      {/* Role & Period Details */}
      <div className="mt-1.5 space-y-0.5 relative z-10">
        <p className="text-xs md:text-sm font-extrabold text-slate-900 tracking-tight">
          {role}
        </p>
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[11px] font-semibold border border-amber-200/80 shadow-2xs">
            {month} Spotlight
          </span>
        </div>
      </div>

      {/* View All Winners Button */}
      <div className="mt-3.5 relative z-10">
        <button
          type="button"
          onClick={onViewAll}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:bg-amber-50/60 hover:border-amber-300 hover:text-amber-900 active:scale-[0.98] transition-all"
        >
          <Award className="h-3.5 w-3.5 text-amber-600" />
          View All Winners
        </button>
      </div>
    </div>
  )
}
