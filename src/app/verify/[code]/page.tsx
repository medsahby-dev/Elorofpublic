import Link from "next/link";
import { db } from "@/lib/db";
import CertificateActions from "@/components/CertificateActions";

export const dynamic = "force-dynamic";

export default async function VerifyCertificate({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const result = await db.query(`
    SELECT cert.certificate_code, cert.issued_at,
           u.first_name, u.last_name,
           c.title AS course_title, c.category, c.level
    FROM certificates cert
    JOIN users u ON u.id=cert.user_id
    JOIN courses c ON c.id=cert.course_id
    WHERE cert.certificate_code=$1 LIMIT 1
  `, [code]);
  const certificate = result.rows[0];

  return (
    <main className="verify-page">
      <div className={"certificate-shell "+(!certificate ? "certificate-invalid":"")}>
        {certificate ? (
          <>
            <div className="certificate-toolbar-wrap"><CertificateActions /></div>
            <section className="certificate-paper" aria-label="Certificat EL PROF">
              <div className="certificate-glow certificate-glow-one" />
              <div className="certificate-glow certificate-glow-two" />
              <div className="certificate-inner">
                <div className="certificate-topline"><span>EL PROF</span><span>ÉDUCATION · TUNISIE</span></div>
                <div className="certificate-brand">EL PROF</div>
                <div className="certificate-kicker">CERTIFICAT DE RÉUSSITE</div>
                <h1>Félicitations</h1>
                <p className="certificate-intro">Ce certificat est officiellement délivré à</p>
                <h2>{certificate.first_name} {certificate.last_name}</h2>
                <p className="certificate-intro">pour avoir terminé avec succès le parcours</p>
                <div className="certificate-course">{certificate.course_title}</div>
                <div className="certificate-meta-grid">
                  <div><small>NIVEAU</small><strong>{certificate.level || "—"}</strong></div>
                  <div><small>DOMAINE</small><strong>{certificate.category || "Français"}</strong></div>
                  <div><small>DÉLIVRÉ LE</small><strong>{new Date(certificate.issued_at).toLocaleDateString("fr-FR")}</strong></div>
                </div>
                <div className="certificate-footer">
                  <div><span className="certificate-sign">EL PROF</span><small>Plateforme éducative</small></div>
                  <div className="certificate-seal"><span>✓</span><small>AUTHENTIQUE</small></div>
                  <div className="certificate-code"><small>CODE DE VÉRIFICATION</small><strong>{certificate.certificate_code}</strong></div>
                </div>
              </div>
            </section>
            <div className="certificate-verification-note"><span>✓</span><div><strong>Certificat authentique</strong><p>Ce document peut être vérifié publiquement avec son code unique.</p></div><Link href={"/verify/"+certificate.certificate_code} className="student-link">Vérifier le code →</Link></div>
          </>
        ) : (
          <section className="verify-card certificate-not-found">
            <div className="verify-mark">×</div><span className="eyebrow">EL PROF · VÉRIFICATION</span>
            <h1>Certificat introuvable</h1><p>Le code fourni ne correspond à aucun certificat enregistré par EL PROF.</p>
            <Link href="/" className="btn btn-dark">Retour à EL PROF</Link>
          </section>
        )}
      </div>
    </main>
  );
}
