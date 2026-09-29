"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Course={id:number;slug:string;title:string;level:string;category:string;description:string;lessons:number;duration:string;access:string};

export default function CoursesPage(){
  const [courses,setCourses]=useState<Course[]>([]); const [filter,setFilter]=useState("Tous"); const [loading,setLoading]=useState(true);
  useEffect(()=>{fetch("/api/courses").then(r=>r.json()).then(d=>d.success&&setCourses(d.courses)).finally(()=>setLoading(false))},[]);
  const visible=useMemo(()=>filter==='Tous'?courses:courses.filter(c=>c.category.toLowerCase().includes(filter.toLowerCase())),[courses,filter]);
  return <main className="page"><div className="page-hero"><span className="eyebrow">CATALOGUE EL PROF</span><h1>Nos cours de français</h1><p>Choisis ton niveau et progresse à ton rythme.</p></div><div className="filter-row">{['Tous','Grammaire','Conjugaison','Compréhension','Expression'].map(f=><button key={f} className={filter===f?"filter active":"filter"} onClick={()=>setFilter(f)}>{f}</button>)}</div>{loading?<div className="empty-state">Chargement des cours…</div>:<div className="course-grid">{visible.map(c=><article className="course-card" key={c.id}><div className="course-icon blue">{c.category==='Grammaire'?'📚':c.category==='Conjugaison'?'🔤':c.category==='Compréhension'?'🧐':c.category==='Expression'?'✍️':'🏆'}</div><span className="course-level">{c.level}</span><h2>{c.title}</h2><p>{c.description}</p><div className="course-meta"><span>📘 {c.lessons} leçons</span><span>⏱ {c.duration}</span></div><Link href={`/cours/${c.slug}`} className="btn btn-yellow full">Voir le cours →</Link></article>)}</div>}</main>;
}
