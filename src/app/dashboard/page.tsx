"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Overview = {
  user:{firstName:string;lastName:string;level:string|null;objective:string|null;subscription:string;xp:number};
  stats:{enrolledCourses:number;completedCourses:number;completedLessons:number;quizAttempts:number;averageQuizScore:number;quizXp:number};
  continueCourse:any|null;
  recentLessons:any[];
  recentQuizzes:any[];
  certificates:any[];
  badges:any[];
};

type LiveClass={id:number;title:string;starts_at:string;status:string};

export default function Dashboard(){
  const [data,setData]=useState<Overview|null>(null);
  const [classes,setClasses]=useState<LiveClass[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    Promise.all([fetch("/api/v1/student/overview",{cache:"no-store"}),fetch("/api/live-classes",{cache:"no-store"})])
      .then(async ([o,c])=>{
        const od=await o.json(); const cd=await c.json();
        if(o.status===401){window.location.href="/connexion";return;}
        if(od.success)setData(od.data);
        if(cd.success)setClasses(cd.classes||[]);
      }).catch(()=>window.location.href="/connexion").finally(()=>setLoading(false));
  },[]);
  async function logout(){await fetch("/api/auth/logout",{method:"POST"});window.location.href="/";}
  if(loading)return <main className="student-shell"><div className="student-container"><div className="empty-state">Chargement de ton espace…</div></div></main>;
  if(!data)return <main className="student-shell"><div className="student-container"><div className="empty-state">Impossible de charger ton espace.</div></div></main>;
  const name=data.user.firstName||"Élève";
  const resume=data.continueCourse;
  const nextClass=classes[0];
  return <main className="student-shell">
    <div className="student-container">
      <div className="student-hero">
        <div><span className="eyebrow">ESPACE ÉLÈVE</span><h1>Bonjour {name} 👋</h1><p>{data.user.objective||"Continue ton parcours et progresse à ton rythme."}</p></div>
        <div className="student-xp-card"><small>TON EXPÉRIENCE</small><strong>⭐ {data.user.xp} XP</strong></div>
      </div>
      <div className="student-stats">
        <div className="student-stat"><small>Cours suivis</small><strong>{data.stats.enrolledCourses}</strong></div>
        <div className="student-stat"><small>Leçons terminées</small><strong>{data.stats.completedLessons}</strong></div>
        <div className="student-stat"><small>Quiz réalisés</small><strong>{data.stats.quizAttempts}</strong></div>
        <div className="student-stat"><small>Score moyen</small><strong>{data.stats.averageQuizScore}%</strong></div>
      </div>
      <div className="student-grid">
        <div className="student-panel">
          <h2>▶ Reprendre mon apprentissage</h2>
          {resume ? <div className="resume-card">
            <div className="resume-top"><div><span className="eyebrow">{resume.category}</span><h3>{resume.title}</h3><p>{resume.last_lesson_title||"Continuer le parcours"}</p></div><strong>{resume.progress}%</strong></div>
            <div className="student-progress"><span style={{width:`${resume.progress}%`}} /></div>
            <div className="resume-actions"><small>{resume.completed_lessons}/{resume.total_lessons} leçons terminées</small><Link className="btn btn-yellow" href={`/cours/${resume.slug}`}>{resume.progress>0?"Continuer":"Commencer"} →</Link></div>
          </div> : <div className="resume-card"><h3>Construis ton parcours</h3><p>Choisis un cours et commence ta progression.</p><Link className="btn btn-yellow" href="/cours">Découvrir les cours →</Link></div>}
          <h2 style={{marginTop:30}}>⚡ Activité récente</h2>
          <div className="activity-list">
            {data.recentLessons.map(l=><div className="activity-item" key={`l-${l.id}`}><div className="activity-icon">📖</div><div><b>{l.title}</b><small>{l.course_title} · {l.progress}%</small></div></div>)}
            {data.recentQuizzes.map(q=><div className="activity-item" key={`q-${q.id}`}><div className="activity-icon">🧠</div><div><b>{q.quiz_title||"Quiz"}</b><small>{q.percentage}% · +{q.xp_gained} XP</small></div></div>)}
            {!data.recentLessons.length&&!data.recentQuizzes.length&&<div className="empty-state">Ton activité apparaîtra ici dès que tu commenceras à apprendre.</div>}
          </div>
        </div>
        <div className="student-panel">
          <h2>🏅 Mes badges</h2>
          <div className="badge-grid">{data.badges.map(b=><div key={b.id} className={`badge-item ${b.unlocked?"":"locked"}`}><span>{b.icon}</span><b>{b.title}</b><small>{b.description}</small></div>)}</div>
          <h2 style={{marginTop:30}}>🎓 Mes certificats</h2>
          <div className="certificate-list">{data.certificates.map(c=><div className="certificate-item" key={c.id}><span className="cert-icon">🎓</span><div><b>{c.course_title}</b><small>{new Date(c.issued_at).toLocaleDateString("fr-FR")}</small></div><Link className="student-link" href={`/verify/${c.certificate_code}`}>Vérifier</Link></div>)}{!data.certificates.length&&<div className="empty-state">Termine un parcours à 100 % pour obtenir ton premier certificat.</div>}</div>
          <h2 style={{marginTop:30}}>🎥 Prochaine classe</h2>
          {nextClass?<div className="resume-card"><span className="eyebrow">CLASSE EN DIRECT</span><h3>{nextClass.title}</h3><p>{new Date(nextClass.starts_at).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"})}</p><Link href="/classes" className="student-link">Voir les classes →</Link></div>:<div className="resume-card"><h3>Aucune classe programmée</h3><p>Les prochaines sessions apparaîtront ici.</p></div>}
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",gap:15,marginTop:25,flexWrap:"wrap"}}><Link href="/cours" className="btn btn-dark">📚 Explorer les cours</Link><Link href="/quiz" className="btn btn-light">🧠 S'entraîner avec les quiz</Link><button onClick={logout} className="btn btn-light">↪ Déconnexion</button></div>
    </div>
  </main>;
}
