import Link from "next/link";

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={"ep-logo" + (compact ? " ep-logo-compact" : "")} aria-label="EL PROF — accueil">
      <span className="ep-logo-symbol ep-logo-image" aria-hidden="true">
        <img
          src="/reference/elprof-logo.webp"
          alt="EL PROF"
          width={64}
          height={64}
        />
      </span>
    </Link>
  );
}
