"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LiveClass = { id:number; title:string; description:string|null; starts_at:string; ends_at:string|null; room_id:string; provider:string; status:string; course_title:string|null; teacher_name:string|null };

export default function ClassesPage(){
  const [classes,setClasses]=useState<LiveClass[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{fetch("/api/live-classes").then(r=>r.json()).then(d=>{if(d.success)setClasses(d.classes);else setError(d.message||"Erreur")}).catch(()=>setError("Impossible de charger les classes.")).finally(()=>setLoading(false))},[]);
  return <main className="page">
    <div className="page-hero"><span className="eyebrow">🎥 CLASSE VIRTUELLE EL PROF</span><h1>Les cours en direct</h1><p>Apprends avec ton professeur en visioconférence, directement depuis la plateforme.</p></div>
    <div className="live-info"><div><b>Une expérience pensée pour l'école</b><p>Vidéo, audio, partage d'écran, documents et échanges en direct. L'intégration du moteur de visioconférence sera activée après validation de l'infrastructure.</p></div><span>🔒</span></div>
    <h2 className="section-heading">Prochains cours</h2>
    {loading ? <div className="empty-state">Chargement…</div> : error ? <div className="empty-state">{error}</div> : classes.length===0 ? <div className="empty-state"><b>Aucun cours en direct programmé.</b><p>Les prochains cours apparaîtront ici dès qu'un professeur les aura programmés.</p></div> : <div className="live-grid">{classes.map(c=><article className="live-card" key={c.id}><div className="live-status">{c.status==='live'?'🔴 EN DIRECT':'📅 PROGRAMMÉ'}</div><h2>{c.title}</h2><p>{c.description||"Cours de français EL PROF."}</p><small>{c.course_title||"Français"} · {c.teacher_name||"Professeur EL PROF"}</small><div className="live-time">{new Date(c.starts_at).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"})}</div><button className="btn btn-yellow full" disabled={c.status!=='live'}>{c.status==='live'?'Rejoindre la classe →':'Disponible à l’heure du cours'}</button></article>)}</div>}
    <Link href="/dashboard" className="back-home">← Retour au tableau de bord</Link>
  </main>
}
