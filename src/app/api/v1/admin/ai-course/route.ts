import {requireAdmin,audit} from "@/lib/admin";
import {FRENCH_LEVELS,OFFICIAL_COLLEGE_FRAME,CURRICULUM_SOURCES} from "@/data/curriculum/francais-tunisie";

export const runtime="nodejs";
export const dynamic="force-dynamic";

type CourseDraft={
 title:string; level:string; activity:string; duration:number;
 competence:string; objectives:string[]; prerequisites:string[];
 support:string; procedure:{phase:string;minutes:number;teacher:string;learner:string}[];
 trace:string; assessment:string[]; remediation:string[]; extension:string[];
 alignment:string[]; sourceLimits:string[]; status:"draft";
};

function fallback(body:any,level:any,activity:string,duration:number):CourseDraft{
 const theme=String(body.theme||"").trim();
 return {
  title:theme?"Cours de français — "+theme:"Cours de français — "+activity,
  level:level.label,activity,duration,competence:"À préciser à partir du programme officiel correspondant.",
  objectives:["Formuler des objectifs observables après vérification du programme et du support."],
  prerequisites:["À déterminer à partir des acquis explicitement documentés."],
  support:"Support à fournir ou sélectionner par l’administrateur.",
  procedure:[
   {phase:"Mise en situation / entrée dans l’activité",minutes:10,teacher:"Installer la situation d’apprentissage.",learner:"Mobiliser ses acquis et formuler des hypothèses."},
   {phase:"Activité guidée",minutes:25,teacher:"Guider l’observation et la construction du sens.",learner:"Observer, chercher, justifier."},
   {phase:"Structuration",minutes:15,teacher:"Faire expliciter les acquis.",learner:"Formuler et organiser les acquis."},
   {phase:"Évaluation / remédiation",minutes:10,teacher:"Vérifier les objectifs et repérer les besoins.",learner:"Produire et s’autoévaluer."}
  ],
  trace:"Trace écrite à finaliser après validation du contenu officiel et du support.",
  assessment:["Évaluation formative à aligner sur l’objectif officiel vérifié."],
  remediation:["Prévoir une activité différenciée selon les erreurs observées."],
  extension:["Prolongement à définir selon le programme et le support validés."],
  alignment:level.cycle==="Deuxième cycle de l’enseignement de base"?OFFICIAL_COLLEGE_FRAME.components:["Français — enseignement secondaire"],
  sourceLimits:["Le référentiel actuellement intégré ne contient pas encore les détails de tous les niveaux.","Aucun contenu non présent dans les sources intégrées ne doit être présenté comme officiel."],
  status:"draft"
 };
}

export async function POST(request:Request){
 const {user,response}=await requireAdmin(request); if(response)return response;
 try{
  const body=await request.json();
  const level=FRENCH_LEVELS.find(x=>x.id===body.level);
  const activity=String(body.activity||"Lecture");
  const theme=String(body.theme||"").trim();
  const duration=Math.max(15,Math.min(180,Number(body.duration)||60));
  if(!level)return Response.json({success:false,error:{code:"INVALID_LEVEL",message:"Niveau non reconnu dans le référentiel."}},{status:400});

  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey){
   const data=fallback(body,level,activity,duration);
   await audit(user!.id,"ai_course_draft_created","ai_course",undefined,{level:level.id,activity,theme,duration,provider:"fallback"});
   return Response.json({success:true,data,mode:"reference-only",warning:"OPENAI_API_KEY n’est pas configurée : brouillon de sécurité généré sans appel IA."});
  }

  const reference=JSON.stringify({sources:CURRICULUM_SOURCES,framework:OFFICIAL_COLLEGE_FRAME,level,activity,theme,duration});
  const instructions=[
   "Tu es EL PROF — IA PÉDAGOGIQUE ADMIN, exclusivement destinée à un administrateur.",
   "Ta mission est de produire un BROUILLON de cours de français tunisien, jamais une publication automatique.",
   "RÈGLE ABSOLUE : ne présente jamais comme officiel un contenu qui n'est pas explicitement présent dans le référentiel fourni.",
   "Si une information manque dans les sources, écris clairement qu'elle doit être vérifiée ou complétée par l'administrateur.",
   "Respecte la terminologie et l'organisation des sources. Ne remplace pas le référentiel par tes connaissances générales.",
   "Pour les niveaux dont le détail officiel n'est pas encore intégré, produis une structure prudente et marque les limites de la source.",
   "Réponds UNIQUEMENT avec un objet JSON valide contenant : title, level, activity, duration, competence, objectives[], prerequisites[], support, procedure[] avec phase/minutes/teacher/learner, trace, assessment[], remediation[], extension[], alignment[], sourceLimits[].",
   "La somme des minutes de procedure doit être égale à duration."
  ].join("\n");

  const input=JSON.stringify({instructions,reference});
  const api=await fetch("https://api.openai.com/v1/responses",{
   method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+apiKey},
   body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-5.6-luna",input,max_output_tokens:5000})
  });
  if(!api.ok){
   const msg=await api.text();
   console.error("openai-ai-course",msg);
   return Response.json({success:false,error:{code:"AI_PROVIDER_ERROR",message:"Le moteur IA n’a pas répondu. Aucun cours n’a été publié."}},{status:502});
  }
  const raw:any=await api.json();
  const text=raw.output_text||raw.output?.flatMap((x:any)=>x.content||[]).map((x:any)=>x.text||"").join("")||"";
  let generated:CourseDraft;
  try{generated=JSON.parse(text)}catch{throw new Error("Réponse IA non JSON");}
  const data={...generated,status:"draft",level:level.label,activity,duration,sourceLimits:[...(generated.sourceLimits||[]),"Brouillon soumis à validation humaine avant toute publication."]};
  await audit(user!.id,"ai_course_draft_created","ai_course",undefined,{level:level.id,activity,theme,duration,provider:"openai",model:process.env.OPENAI_MODEL||"gpt-5.6-luna"});
  return Response.json({success:true,data,mode:"ai"},{headers:{"Cache-Control":"no-store"}});
 }catch(error){
  console.error("admin-ai-course",error);
  return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de générer le brouillon pédagogique."}},{status:500});
 }
}
