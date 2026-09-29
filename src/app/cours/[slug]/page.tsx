"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
type Course={id:number;slug:string;title:string;description:string;level:string;category:string;lessons:number;duration:string;student_content?:{introduction?:string;lesson?:string;keyPoints?:string[];examples?:string[];activities?:string[];exercises?:string[];tip?:string};};
export default function CourseDetail({params}:{params:{slug:string}}){
 const [course,setCourse]=useState<Course|null>(null);const [loading,setLoading]=useState(true);
 useEffect(()=>{fetch("/api/courses/"+encodeURIComponent(params.slug),{cache:"no-store"}).then(r=>r.json()).then(j=>j.success&&setCourse(j.course)).finally(()=>setLoading(false))},[params.slug]);
 if(loading)return <main className="page"><div className="empty-state">Chargement du cours…</div></main>;
 if(!course)return <main className="page"><div className="empty-state">Cours introuvable.</div></main>;
 const c=course.student_content||{};
 return <main className="page"><div className="page-hero"><span className="eyebrow">{course.level} · {course.category}</span><h1>{course.title}</h1><p>{course.description}</p></div>
 <div className="student-course-layout"><article className="student-course-card">
  {c.introduction&&<section><h2>Bienvenue dans ce cours</h2><p>{c.introduction}</p></section>}
  {c.lesson&&<section><h2>📖 La leçon</h2><div className="student-lesson">{c.lesson}</div></section>}
  {(c.keyPoints||[]).length>0&&<section><h2>🧠 À retenir</h2>{c.keyPoints!.map((x,i)=><p key={i}>✓ {x}</p>)}</section>}
  {(c.examples||[]).length>0&&<section><h2>💡 Exemples</h2>{c.examples!.map((x,i)=><p key={i}>{x}</p>)}</section>}
  {(c.activities||[]).length>0&&<section><h2>✏️ Activités</h2>{c.activities!.map((x,i)=><p key={i}>{x}</p>)}</section>}
  {(c.exercises||[]).length>0&&<section><h2>📝 Exercices</h2>{c.exercises!.map((x,i)=><p key={i}>{x}</p>)}</section>}
  {c.tip&&<aside className="student-tip"><b>Astuce</b><p>{c.tip}</p></aside>}
  <div className="panel-actions"><Link className="btn btn-light" href="/cours">← Tous les cours</Link><Link className="btn btn-yellow" href={"/quiz?course="+encodeURIComponent(course.slug)}>🧠 Faire le quiz →</Link></div>
 </article></div></main>;
}