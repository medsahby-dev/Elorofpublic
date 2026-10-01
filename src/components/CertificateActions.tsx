"use client";

export default function CertificateActions(){
  return (
    <div className="certificate-toolbar">
      <button type="button" className="btn btn-yellow" onClick={()=>window.print()}>
        Imprimer / Enregistrer en PDF
      </button>
      <button type="button" className="btn btn-light" onClick={()=>window.history.back()}>
        ← Retour
      </button>
    </div>
  );
}
