import {db} from "@/lib/db";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(request:Request,{params}:{params:{slug:string}}){
 try{const r=await db.query("SELECT id,slug,title,description,level,category,lessons,duration,student_content FROM courses WHERE slug=$1 AND published=true",[params.slug]);if(!r.rows[0])return Response.json({success:false,error:"Cours introuvable"},{status:404});return Response.json({success:true,course:r.rows[0]},{headers:{"Cache-Control":"no-store"}})}catch(e){console.error(e);return Response.json({success:false,error:"Impossible de charger le cours"},{status:500})}
}