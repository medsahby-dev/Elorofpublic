"use client";
import {useState} from "react";
import Link from "next/link";
import {ACTIVITIES,FRENCH_LEVELS,CURRICULUM_SOURCES} from "@/data/curriculum/francais-tunisie";

type Draft={
 title:string; level:string; activity:string; duration:number; status:string; competence?:string;
 objectives?:string[]; procedure?:{phase:string;minutes:number;teacher:string;learner:string}[];
 trace?:string; assessment?:string[]; alignment?:string[]; sourceLimits?:string[];
};

export default function AdminIA(){
 const [level,setLevel]=useState("9e"),[activity,setActivity]=useState("Lecture"),[theme,setTheme]=useState(""),[duration,setDuration]=useState(60),[draft,setDraft]=useState<Draft|null>(null),[loading,setLoading]=useState(false),[error,setError]=useState("");
 async function generate(){
  setLoading(true);setError("");setDraft(null);
  try{
   const r=await fetch("/api/v1/admin/ai-course",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({level,activity,theme,duration})});
   const j=await r.json();
   if(!r.ok)throw new Error(j?.error?.message||"Génération impossible");
   if(!j?.data)throw new Error("Le moteur IA n'a pas retourné de brouillon.");
   setDraft(j.data);
  }catch(e:any){setError(e.message||"Erreur")}finally{setLoading(false)}
 }
 return <main className="admin-page">
  <div className="admin-head"><div><span className="eyebrow">IA PÉDAGOGIQUE ADMIN</span><h1>✨ Créateur de cours IA</h1><p className="admin-sub">Générer un brouillon pédagogique contrôlé à partir du référentiel tunisien.</p></div><Link href="/admin" className="btn btn-light">← Administration</Link></div>
  <section className="admin-panel">
   <div className="panel-head"><h2>1. Paramètres du cours</h2><span>ADMIN UNIQUEMENT</span></div>
   <div className="admin-form-grid">
    <label>Niveau<select value={level} onChange={e=>setLevel(e.target.value)}>{FRENCH_LEVELS.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select></label>
    <label>Activité<select value={activity} onChange={e=>setActivity(e.target.value)}>{ACTIVITIES.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
    <label>Thème / objet<input value={theme} onChange={e=>setTheme(e.target.value)} placeholder="Ex. L’amitié"/></label>
    <label>Durée (min)<input type="number" min="15" max="180" value={duration} onChange={e=>setDuration(Number(e.target.value)||60)}/></label>
   </div>
   <button className="btn btn-yellow" onClick={generate} disabled={loading}>{loading?"Génération…":"✨ GÉNÉRER LE BROUILLON"}</button>
   {error&&<div className="admin-alert">{error}</div>}
  </section>
  <section className="admin-panel"><div className="panel-head"><h2>2. Sources de référence</h2><span>{CURRICULUM_SOURCES.length} sources officielles</span></div>{CURRICULUM_SOURCES.map(s=><div className="admin-row" key={s.id}><div><b>{s.title}</b><small>{s.publisher}{s.date?" · "+s.date:""}</small></div><a href={s.url} target="_blank" rel="noreferrer">Source officielle ↗</a></div>)}</section>
  {draft&&<section className="admin-panel">
   <div className="panel-head"><h2>3. Brouillon généré</h2><span>NON PUBLIÉ</span></div>
   <div className="ai-draft">
    <h3>{draft.title}</h3><p><b>{draft.level}</b> · {draft.activity} · {draft.duration} min</p>
    {draft.competence&&<p><b>Compétence :</b> {draft.competence}</p>}
    {(draft.alignment?.length ?? 0)>0&&<div className="ai-checks">{draft.alignment!.map((x,i)=><span key={i}>✓ {x}</span>)}</div>}
    {(draft.objectives?.length ?? 0)>0&&<><h4>Objectifs</h4><ul>{draft.objectives!.map((x,i)=><li key={i}>{x}</li>)}</ul></>}
    {(draft.procedure?.length ?? 0)>0&&<><h4>Déroulement</h4><ol>{draft.procedure!.map((x,i)=><li key={i}><b>{x.phase}</b> — {x.minutes} min<br/><small>Enseignant : {x.teacher} · Élève : {x.learner}</small></li>)}</ol></>}
    {draft.trace&&<><h4>Trace écrite</h4><p>{draft.trace}</p></>}
    {(draft.assessment?.length ?? 0)>0&&<><h4>Évaluation</h4><ul>{draft.assessment!.map((x,i)=><li key={i}>{x}</li>)}</ul></>}
    {(draft.sourceLimits?.length ?? 0)>0&&<div className="admin-alert">{draft.sourceLimits!.join(" ")}</div>}
    <div className="panel-actions"><button className="btn btn-light" type="button">Modifier</button><button className="btn btn-light" type="button">Prévisualiser</button><button className="btn btn-yellow" type="button" disabled>🚀 Publier après validation</button></div>
   </div>
  </section>}
 </main>
}
