import Link from "next/link";

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <style>{`
        .v2-student-image{
          content:url('/reference/elprof-student-cutout.svg') !important;
          width:min(680px,100%) !important;
          height:auto !important;
          max-height:none !important;
          object-fit:contain !important;
          object-position:center !important;
          clip-path:none !important;
          -webkit-mask-image:none !important;
          mask-image:none !important;
          filter:drop-shadow(0 28px 34px rgba(16,75,150,.15)) !important;
        }
        .v2-student-stage:after{display:none !important}
        @media(max-width:700px){
          .v2-student-image{
            width:min(520px,126%) !important;
            height:auto !important;
          }
        }
      `}</style>
      <Link
        href="/"
        className={"ep-logo" + (compact ? " ep-logo-compact" : "")}
        aria-label="EL PROF — accueil"
      >
        <span className="ep-logo-symbol ep-logo-image" aria-hidden="true">
          <img
            src="/reference/elprof-logo.webp"
            alt="EL PROF"
            width={64}
            height={64}
          />
        </span>
      </Link>
    </>
  );
}
