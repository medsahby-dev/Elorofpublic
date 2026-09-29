import Link from "next/link";
import { db } from "@/lib/db";

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
  return <main className="verify-page">
    <div className="verify-card">
      <div className="verify-mark">✓</div>
      <span className="eyebrow">EL PROF · VÉRIFICATION</span>
      <h1>{certificate ? "Certificat authentique" : "Certificat introuvable"}</h1>
      {certificate ? <>
        <p>Ce certificat a été délivré à</p>
        <h2>{certificate.first_name} {certificate.last_name}</h2>
        <p>pour la réussite du parcours</p>
        <strong>{certificate.course_title}</strong>
        <div className="verify-meta"><span>{certificate.level}</span><span>{new Date(certificate.issued_at).toLocaleDateString("fr-FR")}</span><span>{certificate.certificate_code}</span></div>
      </> : <p>Le code fourni ne correspond à aucun certificat enregistré par EL PROF.</p>}
      <Link href="/" className="btn btn-dark">Retour à EL PROF</Link>
    </div>
  </main>;
}
