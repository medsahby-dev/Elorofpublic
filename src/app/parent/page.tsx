"use client";

import Link from "next/link";
import { useEffect,useMemo,useState } from "react";

type Child={id:number;first_name:string;last_name:string;level:string|null;progress:number;completed_courses:number;completed_lessons:number;quiz_attempts:number;average_quiz:number;last_activity:string|null};
type Overview={parent:{firstName:string;lastName:string;plan:string};children:Child[];courses:any[];activity:any[]};

export default function ParentPage(){
 const [data,setData]=useState<Overview|null>(null);const [selected,setSelected]=useState<number|null>(null);const [code,setCode]=useState("");const [message,setMessage]=useState("");const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);
 async function load(){setLoading(true);try{const r=await fetch("/api/v1/parent/overview",{cache:"no-store"});const j=await r.json();if(r.status===401){window.location.href="/connexion";return}if(!r.ok)throw new Error(j?.error?.message||"Accès impossible");setData(j.data);if(selected===null&&j.data.children[0])setSelected(j.data.children[0].id);}catch(e:any){setMessage(e.message||"Impossible de charger l'espace parent.");}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 const child=data?.children.find(c=>c.id===selected)||data?.children[0];
 const childCourses=useMemo(()=>data?.courses.filter(c=>c.user_id===child?.id).slice(0,6)||[],[data,child]);
 const childActivity=useMemo(()=>data?.activity.filter(a=>a.user_id===child?.id).slice(0,6)||[],[data,child]);
 async function linkChild(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage("");try{const r=await fetch("/api/v1/parent/overview",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code})});const j=await r.json();if(!r.ok)throw new Error(j?.error?.message||"Code invalide");setCode("");setMessage("Élève ajouté à votre suivi.");await load();}catch(e:any){setMessage(e.message||"Impossible d'ajouter l'élève.");}finally{setBusy(false)}}
 async function logout(){await fetch("/api/auth/logout",{method:"POST"});window.location.href="/";}
 if(loading)return <main className="parent-page"><div className="parent-container"><div className="empty-state">Chargement de votre espace parent…</div></div></main>;
 if(!data)return <main className="parent-page"><div className="parent-container"><div className="empty-state">{message}</div><Link href="/connexion" className="btn btn-yellow">Se connecter</Link></div></main>;
 return <main className="parent-page"><div className="parent-container">
  <header className="parent-head"><div><span className="eyebrow">EL PROF · ESPACE PARENT</span><h1>Bonjour {data.parent.firstName}.</h1><p>Suivez les progrès de votre enfant avec une vision claire et simple.</p></div><div className="parent-plan"><small>ABONNEMENT</small><b>PREMIUM FAMILLE · 49 DT/mois</b></div></header>
  {message&&<div className="form-message" style={{marginBottom:18}}>{message}</div>}
  {child?<><div className="parent-kpis"><div className="parent-kpi"><small>Progression globale</small><strong>{child.progress}%</strong></div><div className="parent-kpi"><small>Cours terminés</small><strong>{child.completed_courses}</strong></div><div className="parent-kpi"><small>Quiz réalisés</small><strong>{child.quiz_attempts}</strong></div><div className="parent-kpi"><small>Moyenne aux quiz</small><strong>{child.average_quiz}%</strong></div></div>
   <div className="parent-grid"><section className="parent-panel"><h2>Vos enfants</h2><div className="child-select">{data.children.map(c=><button key={c.id} className={selected===c.id?"child-pill active":"child-pill"} onClick={()=>setSelected(c.id)}>{c.first_name} {c.last_name}</button>)}</div><h2>Progression des parcours</h2>{childCourses.length?childCourses.map(c=><div className="parent-progress-row" key={c.title}><span>{c.title}</span><i><span style={{width:String(c.progress)+"%"}}/></i><b>{c.progress}%</b></div>):<div className="empty-state">Les parcours de votre enfant apparaîtront ici.</div>}</section>
   <aside className="parent-panel"><h2>Activité récente</h2><div className="parent-activity">{childActivity.length?childActivity.map(a=><div className="parent-activity-item" key={String(a.user_id)+"-"+a.title+"-"+a.last_seen_at}><div><b>{a.title}</b><small>{a.course_title} · {a.status==="completed"?"Leçon terminée":"En cours"}</small></div></div>):<div className="empty-state">Aucune activité récente.</div>}</div></aside></div>
  </>:<div className="parent-panel"><h2>Commencer le suivi familial</h2><p>Demandez à votre enfant son code famille depuis son espace élève, puis saisissez-le ici.</p></div>}
  <section className="parent-panel family-link" style={{marginTop:18}}><h2>Ajouter un enfant</h2><small>Le code est personnel et temporaire. Il permet de créer un lien de suivi sans partager le mot de passe de l'élève.</small><form onSubmit={linkChild} style={{display:"flex",gap:10,marginTop:12}}><input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} maxLength={8} placeholder="Ex. ELPROF24" aria-label="Code famille"/><button className="btn btn-dark" disabled={busy}>{busy?"Ajout…":"Associer l'élève"}</button></form></section>
  <div style={{display:"flex",justifyContent:"space-between",gap:12,marginTop:22,flexWrap:"wrap"}}><Link href="/cours" className="btn btn-light">Explorer EL PROF</Link><button onClick={logout} className="btn btn-light">Déconnexion</button></div>
 </div></main>;
}
