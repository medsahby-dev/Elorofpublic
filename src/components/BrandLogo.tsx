import Image from "next/image";
import Link from "next/link";

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={"ep-logo" + (compact ? " ep-logo-compact" : "")} aria-label="EL PROF — accueil">
      <span className="ep-logo-symbol ep-logo-image" aria-hidden="true">
        <Image src="/elprof-logo.webp" alt="" width={44} height={44} priority />
      </span>
      <span className="ep-logo-word">EL <b>PROF</b></span>
    </Link>
  );
}
