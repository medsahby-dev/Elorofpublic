"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Course={id:number;slug:string;title:string;level:string;category:string;description:string;lessons:number;duration:string;access:string};

const coverByCategory:Record<string,string>={
  Grammaire:"/reference/course-grammaire.svg",
  Conjugaison:"/reference/course-conjugaison.svg",
  Compréhension:"/reference/course-comprehension.svg",
  Expression:"/reference/course-expression.svg",
  Méthodologie:"/reference/course-methodologie.svg",
};

function coverFor(category:string){
  if(category.toLowerCase().includes("bac")) return "/reference/course-bac.svg";
  return coverByCategory[category]||"/reference/course-grammaire.svg";
}

export default function CoursesPage(){
  const params=useSearchParams();
  const levelParam=params.get("level")||"";
  const [courses,setCourses]=useState<Course[]>([]);
  const [filter,setFilter]=useState("Tous");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    fetch("/api/courses")
      .then(r=>r.json())
      .then(d=>d.success&&setCourses(d.courses))
      .finally(()=>setLoading(false));
  },[]);

  const visible=useMemo(()=>{
    const byCategory=filter==="Tous"?courses:courses.filter(c=>c.category.toLowerCase().includes(filter.toLowerCase()));
    if(!levelParam) return byCategory;
    const wanted=levelParam.trim().toLowerCase();
    return byCategory.filter(c=>{
      const current=String(c.level||"").trim().toLowerCase();
      return current===wanted || (wanted==="bac tunisien" && current.includes("bac")) || (wanted==="bac" && current.includes("bac"));
    });
  },[courses,filter,levelParam]);

  return <main className="page courses-v2">
    <div className="page-hero courses-hero">
      <div>
        <span className="eyebrow">CATALOGUE EL PROF</span>
        <h1>Apprends avec des parcours <span>clairs et structurés.</span></h1>
        <p>Choisis une matière, un niveau et avance à ton rythme avec des cours pensés pour les apprenants tunisiens.</p>
      </div>
      <Link href="/#niveaux" className="btn btn-light">Explorer les niveaux →</Link>
    </div>

    <div className="course-toolbar">
      <div className="filter-row">{["Tous","Grammaire","Conjugaison","Compréhension","Expression"].map(f=>
        <button key={f} className={filter===f?"filter active":"filter"} onClick={()=>setFilter(f)}>{f}</button>
      )}</div>
      <span className="course-count">{loading?"Chargement…":`${visible.length} parcours${levelParam?` · ${levelParam}`:""}`}</span>
    </div>

    {loading
      ? <div className="empty-state">Chargement des cours…</div>
      : visible.length===0
        ? <div className="empty-state"><b>Aucun cours trouvé.</b><p>Les nouveaux parcours apparaîtront ici dès leur publication.</p></div>
        : <div className="course-grid">{visible.map(c=>
          <article className="course-card course-card-v2" key={c.id}>
            <div className="course-cover">
              <Image src={coverFor(c.category)} alt="" fill sizes="(max-width:650px) 100vw, (max-width:900px) 50vw, 33vw"/>
              <span>{c.level}</span>
            </div>
            <div className="course-card-body">
              <div className="course-card-kicker">{c.category}</div>
              <h2>{c.title}</h2>
              <p>{c.description}</p>
              <div className="course-meta"><span>◈ {c.lessons} leçons</span><span>◷ {c.duration}</span></div>
              <Link href={`/cours/${c.slug}`} className="btn btn-yellow full">Voir le parcours <span>→</span></Link>
            </div>
          </article>
        )}</div>}
  </main>;
}
