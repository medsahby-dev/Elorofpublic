"use client";
import {useState} from "react";
import Link from "next/link";
import {ACTIVITIES,FRENCH_LEVELS,CURRICULUM_SOURCES} from "@/data/curriculum/francais-tunisie";

type StudentContent={introduction:string;lesson:string;keyPoints:string[];examples:string[];activities:string[];exercises:string[];tip:string};
type Draft={id?:number;title:string;level:string;activity:string;duration:number;status:string;competence?:string;objectives?:string[];procedure?:{phase:string;minutes:number;teacher:string;learner:string}[];trace?:string;assessment?:string[];alignment?:string[];sourceLimits?:string[];studentContent?:StudentContent};
type Quiz={id:number;title:string;level:string;activity:string;difficulty:string;questions:{question:string;options:string[];correctIndex:number;explanation:string}[];status:string};

export default function AdminIA(){
 const [level,setLevel]=useState("9e"),[activity,setActivity]=useState("Lecture"),[theme,setTheme]=useState(""),[duration,setDuration]=useState(60),[draft,setDraft]=useState<Draft|null>(null),[quiz,setQuiz]=useState<Quiz|null>(null),[loading,setLoading]=useState(false),[quizLoading,setQuizLoading]=useState(false),[error,setError]=useState("");
 async function generate(){
  setLoading(true);setError("");setDraft(null);setQuiz(null);
  try{const r=await fetch("/api/v1/admin/ai-course",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({level,activity,theme,duration})});const j=await r.json();if(!r.ok)throw new Error(j?.error?.message||"Génération impossible");setDraft({...j.data,id:j.draftId});}
  catch(e:any){setError(e.message||"Erreur")}finally{setLoading(false)}
 }
 async function generateQuiz(){
  if(!draft?.id)return;
  setQuizLoading(true);setError("");
  try{const r=await fetch("/api/v1/admin/ai-quiz",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({level,activity,theme,courseDraftId:draft.id,studentContent:draft.studentContent,questionCount:10,difficulty:"moyenne"})});const j=await r.json();if(!r.ok)throw new Error(j?.error?.message||"Quiz impossible");setQuiz(j.data);}
  catch(e:any){setError(e.message||"Erreur")}finally{setQuizLoading(false)}
 }
 async function quizAction(action:string){
  if(!quiz?.id)return;
  const r=await fetch("/api/v1/admin/ai-quiz-action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:quiz.id,action})});
  const j=await r.json();if(!r.ok){setError(j?.error?.message||"Action impossible");return;}
  setQuiz({...quiz,status:action==="publish"?"published":"validated"});
 }
 async function action(action:string){
  if(!draft?.id)return;
  const r=await fetch("/api/v1/admin/ai-course-action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:draft.id,action})});
  const j=await r.json();if(!r.ok){setError(j?.error?.message||"Action impossible");return;}
  setDraft({...draft,status:action==="publish"?"published":"validated"});
 }
 function updateStudent(field:keyof StudentContent,value:string){if(!draft)return;setDraft({...draft,studentContent:{...draft.studentContent!,[field]:value}})}
 return <main className="admin-page">
  <div className="admin-head"><div><span className="eyebrow">IA PÉDAGOGIQUE ADMIN</span><h1>✨ Créateur de cours IA</h1><p className="admin-sub">Créer du contenu directement destiné aux élèves, puis le contrôler avant publication.</p></div><Link href="/admin" className="btn btn-light">← Administration</Link></div>
  <section className="admin-panel">
   <div className="panel-head"><h2>1. Paramètres du cours</h2><span>ADMIN UNIQUEMENT</span></div>
   <div className="admin-form-grid">
    <label>Niveau<select value={level} onChange={e=>setLevel(e.target.value)}>{FRENCH_LEVELS.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select></label>
    <label>Activité<select value={activity} onChange={e=>setActivity(e.target.value)}>{ACTIVITIES.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
    <label>Thème / objet<input value={theme} onChange={e=>setTheme(e.target.value)} placeholder="Ex. L’amitié"/></label>
    <label>Durée (min)<input type="number" min="15" max="180" value={duration} onChange={e=>setDuration(Number(e.target.value)||60)}/></label>
   </div>
   <button className="btn btn-yellow" onClick={generate} disabled={loading}>{loading?"Génération…":"✨ GÉNÉRER LE COURS ÉLÈVE"}</button>
   {error&&<div className="admin-alert">{error}</div>}
  </section>
  <section className="admin-panel"><div className="panel-head"><h2>2. Sources de référence</h2><span>{CURRICULUM_SOURCES.length} sources officielles</span></div>{CURRICULUM_SOURCES.map(s=><div className="admin-row" key={s.id}><div><b>{s.title}</b><small>{s.publisher}{s.date?" · "+s.date:""}</small></div><a href={s.url} target="_blank" rel="noreferrer">Source officielle ↗</a></div>)}</section>
  {draft&&<section className="admin-panel">
   <div className="panel-head"><h2>3. Contenu destiné aux élèves</h2><span>{draft.status.toUpperCase()}</span></div>
   <div className="ai-draft">
    <input className="admin-title-input" value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/>
    <p><b>{draft.level}</b> · {draft.activity} · {draft.duration} min</p>
    {draft.studentContent&&<div className="student-preview">
      <h3>🎓 Aperçu élève</h3>
      <label>Introduction<textarea value={draft.studentContent.introduction} onChange={e=>updateStudent("introduction",e.target.value)}/></label>
      <label>Leçon<textarea value={draft.studentContent.lesson} onChange={e=>updateStudent("lesson",e.target.value)}/></label>
      <h4>À retenir</h4>{draft.studentContent.keyPoints.map((x,i)=><p key={i}>✓ {x}</p>)}
      <h4>Exemples</h4>{draft.studentContent.examples.map((x,i)=><p key={i}>{x}</p>)}
      <h4>Activités</h4>{draft.studentContent.activities.map((x,i)=><p key={i}>{x}</p>)}
      <h4>Exercices</h4>{draft.studentContent.exercises.map((x,i)=><p key={i}>{x}</p>)}
      <p><b>Astuce :</b> {draft.studentContent.tip}</p>
    </div>}
    {draft.competence&&<p><b>Compétence :</b> {draft.competence}</p>}
    {(draft.objectives?.length ?? 0)>0&&<><h4>Objectifs pédagogiques</h4><ul>{draft.objectives!.map((x,i)=><li key={i}>{x}</li>)}</ul></>}
    {(draft.procedure?.length ?? 0)>0&&<><h4>Déroulement enseignant</h4><ol>{draft.procedure!.map((x,i)=><li key={i}><b>{x.phase}</b> — {x.minutes} min<br/><small>Enseignant : {x.teacher} · Élève : {x.learner}</small></li>)}</ol></>}
    {(draft.sourceLimits?.length ?? 0)>0&&<div className="admin-alert">{draft.sourceLimits!.join(" ")}</div>}
    <div className="panel-actions">
      <button className="btn btn-light" type="button" onClick={()=>action("save")}>💾 Enregistrer les modifications</button>
      <button className="btn btn-light" type="button" onClick={generateQuiz} disabled={quizLoading}>{quizLoading?"Quiz…":"📝 Générer le quiz"}</button>
      {draft.status==="draft"&&<button className="btn btn-light" type="button" onClick={()=>action("validate")}>✓ Valider</button>}
      {draft.status==="validated"&&<button className="btn btn-yellow" type="button" onClick={()=>action("publish")}>🚀 Publier</button>}
    </div>
   </div>
  </section>}
  {quiz&&<section className="admin-panel">
   <div className="panel-head"><h2>4. Quiz élève</h2><span>{quiz.status.toUpperCase()}</span></div>
   <div className="ai-draft"><h3>{quiz.title}</h3><p>{quiz.questions.length} questions · difficulté {quiz.difficulty}</p>
    {quiz.questions.map((q,i)=><div className="quiz-admin-question" key={i}><b>{i+1}. {q.question}</b>{q.options.map((o,j)=><div key={j} className={j===q.correctIndex?"quiz-correct":"quiz-option"}>{String.fromCharCode(65+j)}. {o}</div>)}<small>Correction : {q.explanation}</small></div>)}
    <div className="admin-alert">Le quiz reste un brouillon tant qu’il n’est pas validé par l’administrateur.</div><div className="panel-actions">{quiz.status==="draft"&&<button className="btn btn-light" type="button" onClick={()=>quizAction("validate")}>✓ Valider le quiz</button>}{quiz.status==="validated"&&<button className="btn btn-yellow" type="button" onClick={()=>quizAction("publish")}>🚀 Publier le quiz</button>}</div>
   </div>
  </section>}
 </main>
}