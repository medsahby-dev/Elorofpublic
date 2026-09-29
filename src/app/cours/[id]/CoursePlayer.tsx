"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Lesson = { id:number; title:string; slug:string; description:string|null; content:string|null; lessonType:string; durationMinutes:number|null; position:number; isPreview:boolean; progress:number; progressStatus:string; completed:boolean; resources:Array<{id:number;title:string;resourceType:string;url:string}>; quizzes:Array<{id:number;title:string;description:string|null;passingScore:number;maxAttempts:number|null}> };
type Module = { id:number; title:string; description:string|null; position:number; lessons:Lesson[] };
type Course = { id:number; slug:string; title:string; description:string; level:string; category:string; access:string; lessons:number; duration:string|null };

export default function CoursePlayer({ slug, initialCourse }: { slug:string; initialCourse:Course }) {
  const [course,setCourse]=useState<Course>(initialCourse);
  const [modules,setModules]=useState<Module[]>([]);
  const [selected,setSelected]=useState<Lesson|null>(null);
  const [progress,setProgress]=useState(0);
  const [enrolled,setEnrolled]=useState(false);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const lessons=useMemo(()=>modules.flatMap(m=>m.lessons),[modules]);

  async function load() {
    setLoading(true);
    try {
      const res=await fetch(`/api/v1/courses/${encodeURIComponent(slug)}/learning`,{cache:"no-store"});
      const json=await res.json();
      if(!json.success) throw new Error(json.error?.message||"Erreur");
      setCourse(json.data.course); setModules(json.data.modules); setProgress(Number(json.data.progress||0)); setEnrolled(Boolean(json.data.enrolled));
      const all=json.data.modules.flatMap((m:Module)=>m.lessons) as Lesson[];
      setSelected((current)=>current || all[0] || null);
    } catch { /* page remains usable */ } finally { setLoading(false); }
  }
  useEffect(()=>{load();},[slug]);

  async function enroll() {
    setBusy(true);
    try {
      const res=await fetch(`/api/v1/courses/${encodeURIComponent(slug)}/enroll`,{method:"POST"});
      const json=await res.json();
      if(res.status===401){window.location.href="/connexion";return;}
      if(!res.ok){alert(json.error?.message||"Impossible de rejoindre le cours.");return;}
      await load();
    } finally { setBusy(false); }
  }

  async function completeLesson() {
    if(!selected) return;
    setBusy(true);
    try {
      const res=await fetch(`/api/v1/lessons/${selected.id}/progress`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({progress:100})});
      const json=await res.json();
      if(res.status===401){window.location.href="/connexion";return;}
      if(!res.ok){alert(json.error?.message||"Impossible d'enregistrer la progression.");return;}
      setProgress(Number(json.data.courseProgress||progress));
      await load();
    } finally { setBusy(false); }
  }

  const currentIndex=selected ? lessons.findIndex(l=>l.id===selected.id) : -1;
  const next=currentIndex>=0?lessons[currentIndex+1]:null;
  const previous=currentIndex>0?lessons[currentIndex-1]:null;

  return <main className="page">
    <div className="course-detail-head"><div><span className="eyebrow">{course.category}</span><h1>{course.title}</h1><p>{course.description}</p><div className="course-meta"><span>📘 {lessons.length || course.lessons} leçons</span><span>⏱ {course.duration}</span><span>🎓 {course.level}</span><span>◉ {progress}% terminé</span></div></div><div className="course-cover">EL<br/><b>PROF</b></div></div>
    <div className="lesson-layout">
      <aside className="lesson-sidebar"><b>CONTENU DU PARCOURS</b>{modules.map(m=><div key={m.id} className="module-block"><strong>{m.title}</strong>{m.lessons.map(l=><button key={l.id} onClick={()=>setSelected(l)} className={`lesson-link ${selected?.id===l.id?"selected":""}`}><span>{l.completed?"✓":l.position+1}</span>{l.title}<small>{l.durationMinutes?`${l.durationMinutes} min`:""}</small></button>)}</div>)}</aside>
      <section className="lesson-content">
        {loading ? <div className="empty-state">Chargement du parcours…</div> : !lessons.length ? <div className="empty-state"><h2>Parcours en préparation</h2><p>Le contenu pédagogique de ce cours sera bientôt disponible.</p></div> : <>
          <div className="progress-line"><span style={{width:`${progress}%`}} /></div>
          {!enrolled && <div className="method-box"><b>Commencer ce parcours</b><p>Inscris-toi pour enregistrer ta progression, tes résultats et ton parcours personnel.</p><button className="btn btn-yellow" onClick={enroll} disabled={busy}>🚀 {busy?"Inscription…":"Commencer le cours"}</button></div>}
          {selected && <><span className="mini-label">LEÇON {selected.position+1}</span><h2>{selected.title}</h2>{selected.description && <p className="lead">{selected.description}</p>}<div className="lesson-body">{selected.content ? <p>{selected.content}</p> : <p>Cette leçon sera enrichie depuis le Studio Enseignant.</p>}</div>
            {selected.resources.length>0 && <div className="resource-list"><h3>Ressources</h3>{selected.resources.map(r=><a key={r.id} href={r.url} target="_blank" rel="noreferrer">📎 {r.title}</a>)}</div>}
            {selected.quizzes.length>0 && <div className="method-box"><b>📝 Évaluation</b>{selected.quizzes.map(q=><div key={q.id}><p>{q.title}</p><Link href={`/quiz?quiz=${q.id}`} className="btn btn-light">Commencer le quiz →</Link></div>)}</div>}
            <div className="lesson-nav"><button className="btn btn-light" disabled={!previous} onClick={()=>previous&&setSelected(previous)}>← Précédent</button><button className="btn btn-yellow" disabled={!enrolled||busy} onClick={completeLesson}>{busy?"Enregistrement…":selected.completed?"✓ Leçon terminée":"Marquer comme terminée"}</button><button className="btn btn-light" disabled={!next} onClick={()=>next&&setSelected(next)}>Suivant →</button></div>
          </>}
        </>}
      </section>
    </div>
  </main>;
}
