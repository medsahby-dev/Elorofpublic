"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";

type Lesson={id:number;title:string;description?:string;content?:any;durationMinutes?:number;position:number;progress:number;progressStatus:string;completed:boolean;isPreview?:boolean;quizzes?:any[]};
type Module={id:number;title:string;description?:string;position:number;lessons:Lesson[]};
type Course={id:number;slug:string;title:string;description:string;level:string;category:string;lessons:number;duration:string};
type Learning={course:Course;modules:Module[];enrolled:boolean;progress:number|null};

function renderContent(content:any){
 if(!content) return null;
 if(typeof content==="string") return <div className="student-lesson">{content}</div>;
 if(typeof content==="object") return <div className="student-lesson">{Object.entries(content).map(([k,v])=><div key={k}><strong>{k}</strong><div>{typeof v==="string"?v:JSON.stringify(v,null,2)}</div></div>)}</div>;
 return null;
}

export default function CourseDetail({params}:{params:{slug:string}}){
 const [data,setData]=useState<Learning|null>(null);
 const [selected,setSelected]=useState<Lesson|null>(null);
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const [error,setError]=useState("");

 useEffect(()=>{
   fetch("/api/v1/courses/"+encodeURIComponent(params.slug)+"/learning",{cache:"no-store"})
    .then(async r=>{const j=await r.json();if(!r.ok||!j.success)throw new Error(j.error?.message||"Cours introuvable.");return j.data})
    .then((d:Learning)=>{setData(d);const first=d.modules.flatMap(m=>m.lessons).find(l=>!l.completed)||d.modules[0]?.lessons?.[0]||null;setSelected(first)})
    .catch(e=>setError(e.message||"Impossible de charger le parcours."))
    .finally(()=>setLoading(false));
 },[params.slug]);

 const allLessons=useMemo(()=>data?.modules.flatMap(m=>m.lessons)||[],[data]);
 const currentIndex=selected?allLessons.findIndex(l=>l.id===selected.id):-1;
 const doneCount=allLessons.filter(l=>l.completed).length;
 const localProgress=allLessons.length?Math.round(doneCount/allLessons.length*100):Number(data?.progress||0);

 async function completeLesson(){
   if(!selected||!data?.enrolled){setMessage(data?.enrolled?"":"Connecte-toi et inscris-toi au cours pour enregistrer ta progression.");return;}
   setBusy(true);setMessage("");setError("");
   try{
    const r=await fetch("/api/v1/lessons/"+selected.id+"/progress",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({progress:100})});
    const j=await r.json();
    if(r.status===401){window.location.href="/connexion";return;}
    if(!r.ok||!j.success)throw new Error(j.error?.message||"Impossible d'enregistrer.");
    setMessage(j.data?.certificate?"🎓 Parcours terminé : ton certificat est disponible.":"✓ Étape validée. Progression enregistrée.");
    setData(prev=>{if(!prev)return prev;return {...prev,progress:j.data.courseProgress,modules:prev.modules.map(m=>({...m,lessons:m.lessons.map(l=>l.id===selected.id?{...l,completed:true,progress:100,progressStatus:"completed"}:l)}))};});
    setSelected(prev=>prev?{...prev,completed:true,progress:100,progressStatus:"completed"}:prev);
   }catch(e:any){setError(e.message||"Une erreur est survenue.");}
   finally{setBusy(false);}
 }

 async function chooseLesson(l:Lesson){
   setSelected(l);setMessage("");setError("");
   if(!l.id||!data?.enrolled||l.completed||l.progress>0)return;
   try{
    const r=await fetch("/api/v1/lessons/"+l.id+"/progress",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({progress:1})});
    if(r.status===401){window.location.href="/connexion";return;}
    if(r.ok){const j=await r.json();if(j.success)setData(prev=>prev?{...prev,progress:j.data.courseProgress}:prev);}
   }catch{}
 }

 if(loading)return <main className="page"><div className="empty-state">Chargement du parcours…</div></main>;
 if(error||!data)return <main className="page"><div className="empty-state">{error||"Cours introuvable."}</div></main>;
 const {course}=data;
 return <main className="page">
  <div className="course-detail-head"><div><span className="eyebrow">{course.level} · {course.category}</span><h1>{course.title}</h1><p>{course.description}</p></div><div className="course-detail-meta"><span><b>{allLessons.length||course.lessons}</b> leçons</span><span><b>{course.duration}</b></span><span><b>{localProgress}%</b> terminé</span></div></div>
  <div className="lesson-player-layout">
   <aside className="lesson-outline">
    <div className="lesson-outline-head"><span className="eyebrow">PARCOURS</span><strong>{course.title}</strong></div>
    <div className="lesson-progress-mini"><i><span style={{width:localProgress+"%"}}/></i><b>{localProgress}%</b></div>
    <div className="lesson-outline-list">{data.modules.map(m=><div key={m.id} className="lesson-module"><small>{m.position}. {m.title}</small>{m.lessons.map(l=><button key={l.id} className={"lesson-outline-item "+(selected?.id===l.id?"active ":"")+(l.completed?"completed":"")} onClick={()=>chooseLesson(l)}><span>{l.completed?"✓":String(l.position).padStart(2,"0")}</span><b>{l.title}</b></button>)}</div>)}</div>
    <div className="lesson-outline-foot"><small>PROGRESSION</small><strong>{doneCount}/{allLessons.length||0} leçons validées</strong><span>{data.enrolled?"Ton parcours est sauvegardé.":"Inscris-toi pour sauvegarder ta progression."}</span></div>
   </aside>
   <div className="student-course-layout"><article className="student-course-card">
    {selected?<><div className="lesson-current-head"><span className="eyebrow">LEÇON {currentIndex+1} / {allLessons.length}</span><h2>{selected.title}</h2><p>{selected.description||"Avance étape par étape et valide cette leçon lorsque tu as terminé."}</p></div>
    {renderContent(selected.content)}
    {selected.quizzes?.length?<div className="lesson-quiz-box"><span>🧠</span><div><b>{selected.quizzes[0].title}</b><p>Teste tes acquis après cette leçon · seuil {selected.quizzes[0].passingScore}%.</p></div><Link className="btn btn-light" href={"/quiz?quiz="+selected.quizzes[0].id}>Faire le quiz →</Link></div>:null}
    <div className="lesson-complete-box">{message&&<p className="lesson-success">{message}</p>}{error&&<p className="lesson-error">{error}</p>}{!data.enrolled&&<p>🔒 Connecte-toi et inscris-toi au cours pour enregistrer ta progression.</p>}<button className="btn btn-yellow" onClick={completeLesson} disabled={busy||selected.completed||!data.enrolled}>{selected.completed?"✓ Leçon terminée":busy?"Enregistrement…":"J’ai terminé cette leçon →"}</button></div>
    <div className="panel-actions"><Link className="btn btn-light" href="/cours">← Tous les cours</Link>{currentIndex<allLessons.length-1&&<button className="btn btn-dark" onClick={()=>chooseLesson(allLessons[currentIndex+1])}>Leçon suivante →</button>}</div>
    </>:<div className="empty-state">Aucune leçon disponible dans ce parcours.</div>}
   </article></div>
  </div>
 </main>;
}
