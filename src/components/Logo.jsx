export default function Logo({ className = 'h-9 w-9', showText = true, textClass = '' }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg
        viewBox="0 0 64 64"
        className={className}
        role="img"
        aria-label="Shimaal Tours logo"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4fb0ef" />
            <stop offset="100%" stopColor="#8fd0f7" />
          </linearGradient>
          <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#a9e0c3" />
          </linearGradient>
          <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3aa06e" />
            <stop offset="100%" stopColor="#103021" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="31" fill="url(#skyGrad)" opacity="0.15" />
        <circle cx="46" cy="18" r="7" fill="#f7b267" />
        <path d="M4 46 L22 20 L30 32 L38 16 L60 46 Z" fill="url(#hillGrad)" />
        <path d="M22 20 L30 32 L26 32 Z" fill="url(#peakGrad)" />
        <path d="M38 16 L50 34 L42 34 L38 24 L34 34 L26 34 Z" fill="url(#peakGrad)" />
        <path d="M4 46 L60 46 L60 52 Q32 58 4 52 Z" fill="#07140f" opacity="0.85" />
      </svg>
      {showText && (
        <span className={`font-display font-semibold tracking-tight leading-none ${textClass}`}>
          <span className="block text-base sm:text-lg">Shimaal</span>
          <span className="block text-[10px] sm:text-xs uppercase tracking-[0.25em] text-pine-300">
            Tours & Treks
          </span>
        </span>
      )}
    </div>
  );
}
