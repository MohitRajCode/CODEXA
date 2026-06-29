import { Link } from 'react-router-dom';

export default function Logo({ size = 40, showText = true, className = "", textSizeClass = "text-base", to = null }) {
  const content = (
    <>
      <div
        className="rounded-lg bg-[#6D5DFB] flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 16 16" fill="none">
          <path d="M8 1L14 8L8 15L2 8L8 1Z" fill="white" fillOpacity="0.9" />
          <path d="M8 4L11 8L8 12L5 8L8 4Z" fill="white" />
        </svg>
      </div>

      {showText && (
        <span className={`${textSizeClass} font-bold tracking-tight text-white`}>
          Codexa
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
