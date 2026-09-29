import {requireAdmin,audit} from "@/lib/admin";
import {FRENCH_LEVELS,OFFICIAL_COLLEGE_FRAME} from "@/data/curriculum/francais-tunisie";
export const runtime="nodejs"; export const dynamic="force-dynamic";
export async function POST(request:Request){
 const {user,response}=await requireAdmin(request); if(response)return response;
 try{
  const body=await request.json(); const level=FRENCH_LEVELS.find(x=>x.id===body.level); const activity=String(body.activity||"Lecture"); const theme=String(body.theme||"").trim(); const duration=Math.max(15,Math.min(180,Number(body.duration)||60));
  if(!level)return Response.json({success:false,error:{code:"INVALID_LEVEL",message:"Niveau non reconnu dans le référentiel."}},{status:400});
  const alignment=level.cycle==="Deuxième cycle de l’enseignement de base" ? OFFICIAL_COLLEGE_FRAME.components : ["Français — enseignement secondaire"];
  const structure=["Mise en situation / entrée dans l’activité","Objectifs d’apprentissage","Activités guidées et mobilisation des acquis","Trace écrite / structuration","Évaluation et critères de réussite","Remédiation ou prolongement"];
  const data={title:theme?"Cours de français — "+theme:"Cours de français — "+activity,level:level.label,activity,duration,status:"draft",alignment,structure,warning:"Brouillon généré pour l’administrateur. La publication est volontairement désactivée tant que le contenu n’a pas été vérifié par l’administrateur et confronté aux sources officielles correspondantes."};
  await audit(user!.id,"ai_course_draft_created","ai_course",undefined,{level:level.id,activity,theme,duration});
  return Response.json({success:true,data},{headers:{"Cache-Control":"no-store"}});
 }catch(error){console.error("admin-ai-course",error);return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de générer le brouillon."}},{status:500});}
}
