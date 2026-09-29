import {requireAdmin,audit} from "@/lib/admin";
import {db} from "@/lib/db";
import {FRENCH_LEVELS} from "@/data/curriculum/francais-tunisie";

export const runtime="nodejs";
export const dynamic="force-dynamic";

type Question={id:string;type:"single";question:string;options:string[];correctIndex:number;explanation:string};

function fallback(level:any,activity:string,count:number):Question[]{
 return Array.from({length:count},(_,i)=>({
  id:"q"+(i+1),type:"single",
  question:"Question à compléter et valider par l’administrateur.",
  options:["Proposition A","Proposition B","Proposition C","Proposition D"],
  correctIndex:0,
  explanation:"La réponse doit être vérifiée et adaptée au contenu effectivement enseigné."
 }));
}

export async function POST(request:Request){
 const {user,response}=await requireAdmin(request); if(response)return response;
 try{
  const body=await request.json();
  const level=FRENCH_LEVELS.find(x=>x.id===body.level);
  const activity=String(body.activity||"Lecture");
  const theme=String(body.theme||"").trim();
  const difficulty=String(body.difficulty||"moyenne");
  const count=Math.max(3,Math.min(20,Number(body.questionCount)||10));
  const courseDraftId=body.courseDraftId?Number(body.courseDraftId):null;
  if(!level)return Response.json({success:false,error:{code:"INVALID_LEVEL",message:"Niveau non reconnu."}},{status:400});

  let questions:Question[];
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey){
   questions=fallback(level,activity,count);
  }else{
   const prompt=[
    "Tu es EL PROF — IA PÉDAGOGIQUE ADMIN.",
    "Crée un quiz de français destiné aux élèves, jamais à l'administrateur.",
    "Le quiz doit évaluer uniquement le contenu du cours/support fourni et rester adapté au niveau tunisien demandé.",
    "Ne crée aucun contenu présenté comme officiel s'il n'est pas supporté par les informations fournies.",
    "Chaque question doit avoir exactement 4 propositions, une seule réponse correcte, un index correctIndex 0-3 et une explication pédagogique courte.",
    "Réponds UNIQUEMENT avec un JSON : {questions:[{id,type:'single',question,options,correctIndex,explanation}]}",
    "N'utilise pas de markdown dans les questions ou réponses."
   ].join("\n");
   const api=await fetch("https://api.openai.com/v1/responses",{
    method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+apiKey},
    body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-5.6-luna",input:JSON.stringify({
     instructions:prompt,
     course:{level:level.label,activity,theme,difficulty,count},
     courseContent:body.courseContent||body.studentContent||""
    }),max_output_tokens:7000})
   });
   if(!api.ok)return Response.json({success:false,error:{code:"AI_PROVIDER_ERROR",message:"Le moteur IA n’a pas répondu. Aucun quiz n’a été publié."}},{status:502});
   const raw:any=await api.json();
   const text=raw.output_text||raw.output?.flatMap((x:any)=>x.content||[]).map((x:any)=>x.text||"").join("")||"";
   const parsed=JSON.parse(text);
   questions=parsed.questions;
  }

  const saved=await db.query(
   `INSERT INTO ai_quizzes(course_draft_id,title,level_code,activity,question_count,difficulty,questions,created_by)
    VALUES($1,$2,$3,$4,$5,$6,$7::jsonb,$8) RETURNING id`,
   [courseDraftId,"Quiz — "+(theme||activity),level.id,activity,questions.length,difficulty,JSON.stringify(questions),user!.id]
  );
  const id=saved.rows[0].id;
  await audit(user!.id,"ai_quiz_created","ai_quiz",id,{level:level.id,activity,theme,difficulty,questionCount:questions.length});
  return Response.json({success:true,data:{id,title:"Quiz — "+(theme||activity),level:level.label,activity,difficulty,questions,status:"draft"}});
 }catch(error){
  console.error("admin-ai-quiz",error);
  return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de générer le quiz."}},{status:500});
 }
}