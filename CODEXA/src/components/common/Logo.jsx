import { Link } from 'react-router-dom';

export default function Logo({ size = 40, showText = true, className = "", textSizeClass = "text-base", to = null }) {
  const content = (
    <>
      {/* SVG matching the Codexa brand: thick rounded-hexagon C with </> inside, cyan-to-purple gradient */}
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 drop-shadow-lg">
        <defs>
          {/* Cyan top → blue mid → purple bottom, matching the logo image */}
          <linearGradient id="cGrad" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#00D2C8" />
            <stop offset="50%"  stopColor="#2979FF" />
            <stop offset="100%" stopColor="#8B2BE2" />
          </linearGradient>
          {/* Blue to purple for </> symbol */}
          <linearGradient id="tagGrad" x1="20" y1="50" x2="80" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#2979FF" />
            <stop offset="100%" stopColor="#7B2FF7" />
          </linearGradient>
        </defs>

        {/*
          Thick rounded-hexagon C shape with a wavy pointed tail at bottom-right.
          Drawn as a single path:
          - Starts at top-right opening of the C
          - Arcs around the top, left, and curves into a bottom-right tail with a notch/wave
        */}
        <path
          d="
            M 72 18
            C 72 18 62 8 50 8
            C 35 8 18 22 18 50
            C 18 78 35 92 50 92
            C 62 92 72 84 74 78
            L 68 68
            C 64 74 57 78 50 78
            C 41 78 30 68 30 50
            C 30 32 41 22 50 22
            C 57 22 64 26 68 32
            Z
          "
          fill="url(#cGrad)"
        />

        {/* Wavy tail at bottom right (the chat-bubble-like point) */}
        <path
          d="M 68 68 L 80 82 L 64 76 Z"
          fill="url(#cGrad)"
        />

        {/* </> symbol inside - rendered as text for crispness */}
        <text
          x="50"
          y="56"
          textAnchor="middle"
          fill="url(#tagGrad)"
          fontSize="22"
          fontWeight="800"
          fontFamily="'Courier New', Courier, monospace"
          letterSpacing="-1"
        >
          &lt;/&gt;
        </text>
      </svg>

      {showText && (
        <span className={`${textSizeClass} font-black tracking-tight leading-none`}>
          <span className="text-white">code</span>
          <span style={{ background: 'linear-gradient(90deg, #2979FF, #8B2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>x</span>
          <span className="text-white">a</span>
        </span>
      )}
    </>
  );

  if (to !== null) {
    return (
      <Link to={to} className={`flex items-center gap-2.5 ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {content}
    </div>
  );
}
