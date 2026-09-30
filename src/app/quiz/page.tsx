"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState } from "react";

type Choice = { id:number; answer:string; position:number };
type Question = { id:number; question:string; question_type:string; explanation:string|null; points:number; position:number; choices:Choice[] };
type Quiz = { id:number; title:string; description:string|null; passing_score:number; max_attempts:number|null; course_slug:string|null; course_title:string|null };
type CorrectionChoice = { id:number; answer:string; isCorrect:boolean; selected:boolean };
type Correction = { id:number; question:string; explanation:string|null; points:number; correct:boolean; choices:CorrectionChoice[] };

function QuizContent() {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("quiz");
  const [quizzes,setQuizzes] = useState<Quiz[]>([]);
  const [quiz,setQuiz] = useState<any>(null);
  const [questions,setQuestions] = useState<Question[]>([]);
  const [answers,setAnswers] = useState<Record<string,number[]>>({});
  const [index,setIndex] = useState(0);
  const [result,setResult] = useState<any>(null);
  const [loading,setLoading] = useState(true);
  const [submitting,setSubmitting] = useState(false);
  const [error,setError] = useState("");
  const [showCorrections,setShowCorrections] = useState(true);

  useEffect(()=>{
    fetch("/api/v1/quizzes",{cache:"no-store"}).then(r=>r.json()).then(json=>{
      if(!json.success) throw new Error(json.error?.message||"Erreur");
      setQuizzes(json.data||[]);
    }).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  },[]);

  const activeId = requestedId || (quizzes[0] ? String(quizzes[0].id) : "");

  useEffect(()=>{
    if(!activeId) return;
    setLoading(true); setError(""); setResult(null); setAnswers({}); setIndex(0);
    fetch(`/api/v1/quizzes/${activeId}`,{cache:"no-store"}).then(async r=>{
      const json=await r.json();
      if(!r.ok || !json.success) throw new Error(json.error?.message||"Impossible de charger le quiz.");
      setQuiz(json.data.quiz); setQuestions(json.data.questions||[]);
    }).catch(e=>{setError(e.message);setQuiz(null);setQuestions([])}).finally(()=>setLoading(false));
  },[activeId]);

  const current = questions[index];
  const selected = current ? (answers[String(current.id)] || []) : [];

  function toggleChoice(choiceId:number) {
    if(!current) return;
    if(current.question_type === "single_choice" || current.question_type === "true_false") {
      setAnswers(a=>({...a,[String(current.id)]:[choiceId]}));
      return;
    }
    setAnswers(a=>{
      const existing=a[String(current.id)]||[];
      return {...a,[String(current.id)]:existing.includes(choiceId)?existing.filter(id=>id!==choiceId):[...existing,choiceId]};
    });
  }

  async function submit() {
    if(!quiz || !questions.length) return;
    setSubmitting(true); setError("");
    try {
      const res=await fetch(`/api/v1/quizzes/${quiz.id}/attempts`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({answers})});
      const json=await res.json();
      if(res.status===401){window.location.href="/connexion";return;}
      if(!res.ok || !json.success) throw new Error(json.error?.message||"Impossible d'enregistrer la tentative.");
      setResult(json.data);
      setShowCorrections(true);
    } catch(e:any) { setError(e.message || "Erreur"); }
    finally { setSubmitting(false); }
  }

  if(loading && !quiz) return <main className="quiz-page"><div className="quiz-result"><h1>Chargement…</h1></div></main>;

  if(!quiz && quizzes.length) return <main className="quiz-page"><div className="quiz-result"><h1>Choisis ton quiz</h1><div className="quiz-list">{quizzes.map(q=><Link className="btn btn-light" key={q.id} href={`/quiz?quiz=${q.id}`}>{q.title} →</Link>)}</div></div></main>;

  if(error && !quiz) return <main className="quiz-page"><div className="quiz-result"><h1>Impossible de charger le quiz</h1><p>{error}</p><Link className="btn btn-yellow" href="/cours">Retour aux cours</Link></div></main>;

  if(result) return <main className="quiz-page"><div className="quiz-result">
    <span>{result.passed ? "🎉" : "📚"}</span>
    <h1>{result.passed ? "Quiz réussi !" : "Continue à progresser"}</h1>
    <p>{quiz.title}</p>
    <strong>{result.score} / {result.total}</strong>
    <div className="result-xp">{result.percentage}% · +{result.xpGained} XP</div>
    <div className={result.passed?"quiz-result-panel passed":"quiz-result-panel"}>
      <b>{result.passed?"Objectif atteint":"Encore un peu de pratique"}</b>
      <p>{result.passed ? `Tu as atteint le seuil de réussite de ${quiz.passingScore}%. Tu peux poursuivre ton parcours.` : `Seuil de réussite : ${quiz.passingScore}%. Reprends les notions qui te posent difficulté avant une nouvelle tentative.`}</p>
    </div>
    {Array.isArray(result.corrections) && result.corrections.length > 0 && (
      <section className="quiz-corrections">
        <div className="quiz-corrections-head">
          <div><span className="mini-label">RETOUR PÉDAGOGIQUE</span><h2>Correction question par question</h2><p>Identifie tes erreurs, retrouve la bonne réponse et lis l’explication.</p></div>
          <button className="btn btn-light" onClick={()=>setShowCorrections(v=>!v)}>{showCorrections ? "Masquer" : "Afficher"} la correction</button>
        </div>
        {showCorrections && <div className="quiz-correction-list">{(result.corrections as Correction[]).map((item,index)=>(
          <article className={`quiz-correction-item ${item.correct ? "is-correct" : "is-wrong"}`} key={item.id}>
            <div className="quiz-correction-title"><span>{item.correct ? "✓" : "×"}</span><div><b>Question {index+1}</b><p>{item.question}</p></div><small>{item.correct ? "Bonne réponse" : "À revoir"} · {item.points} pt{item.points>1?"s":""}</small></div>
            <div className="quiz-correction-choices">{item.choices.map(choice=>(
              <div className={`quiz-correction-choice ${choice.isCorrect ? "is-correct-answer" : ""} ${choice.selected ? "is-selected" : ""}`} key={choice.id}>
                <span>{choice.isCorrect ? "✓" : choice.selected ? "→" : "○"}</span><span>{choice.answer}</span>
                {choice.selected && !choice.isCorrect && <em>Ta réponse</em>}
                {choice.isCorrect && <em>Bonne réponse</em>}
              </div>
            ))}</div>
            {item.explanation && <div className="quiz-explanation"><b>Pourquoi ?</b><p>{item.explanation}</p></div>}
          </article>
        ))}</div>}
      </section>
    )}
    <div className="hero-buttons"><Link className="btn btn-yellow" href={quiz.course?.slug ? `/cours/${quiz.course.slug}` : "/cours"}>Poursuivre le parcours →</Link><button className="btn btn-light" onClick={()=>{setResult(null);setAnswers({});setIndex(0)}}>Refaire le quiz</button></div>
  </div></main>;

  if(!current) return <main className="quiz-page"><div className="quiz-result"><h1>Quiz vide</h1><p>{quiz?.title}</p></div></main>;

  const progress = ((index+1)/questions.length)*100;
  return <main className="quiz-page"><div className="quiz-head"><span className="eyebrow">QUIZ — EL PROF</span><h1>{quiz.title}</h1><p>{quiz.description}</p><div className="quiz-progress">Question {index+1} sur {questions.length}<span style={{width:`${progress}%`}}/></div></div><div className="quiz-card"><div className="mini-label">{current.question_type === "multiple_choice" ? "PLUSIEURS RÉPONSES" : "UNE RÉPONSE"}</div><h2>{current.question}</h2><div className="choices">{current.choices.map((c,i)=><button key={c.id} onClick={()=>toggleChoice(c.id)} className={selected.includes(c.id)?"choice selected":"choice"}>{String.fromCharCode(65+i)}. {c.answer}</button>)}</div>{error && <p className="error-text">{error}</p>}<div className="lesson-nav"><button className="btn btn-light" disabled={index===0} onClick={()=>setIndex(i=>i-1)}>← Précédent</button>{index < questions.length-1 ? <button className="btn btn-yellow" disabled={!selected.length} onClick={()=>setIndex(i=>i+1)}>Suivant →</button> : <button className="btn btn-yellow" disabled={!selected.length || submitting} onClick={submit}>{submitting?"Correction…":"Terminer le quiz"}</button>}</div></div></main>;
}

export default function QuizPage() {
  return <Suspense fallback={<div>Chargement...</div>}><QuizContent /></Suspense>;
}
