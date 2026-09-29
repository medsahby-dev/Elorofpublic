import Link from "next/link";

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={"ep-logo" + (compact ? " ep-logo-compact" : "")} aria-label="EL PROF — accueil">
      <span className="ep-logo-symbol" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img">
          <defs>
            <linearGradient id="epg" x1="8" y1="8" x2="56" y2="56">
              <stop offset="0" stopColor="#1d6cff"/>
              <stop offset="1" stopColor="#0b3d83"/>
            </linearGradient>
          </defs>
          <rect x="3" y="3" width="58" height="58" rx="18" fill="url(#epg)"/>
          <path d="M17 22h30v5H22v5h21v5H22v5h25v5H17z" fill="#fff"/>
          <circle cx="47" cy="17" r="6" fill="#ffd21c"/>
        </svg>
      </span>
      <span className="ep-logo-word">EL <b>PROF</b></span>
    </Link>
  );
}
