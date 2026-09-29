import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";
export const runtime="nodejs";
export const dynamic="force-dynamic";
function makeCode(){const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let out="";for(let i=0;i<8;i++)out+=chars[Math.floor(Math.random()*chars.length)];return out;}
export async function POST(request:Request){
 const user=await getCurrentUser(request);if(!user)return Response.json({success:false,error:{message:"Connexion requise."}},{status:401});
 if(user.role!=="student")return Response.json({success:false,error:{message:"Réservé aux élèves."}},{status:403});
 try{const r=await db.query("SELECT code,expires_at FROM family_link_codes WHERE student_id=$1",[user.id]);
 if(r.rowCount&&new Date(r.rows[0].expires_at)>new Date())return Response.json({success:true,data:r.rows[0]});
 for(let i=0;i<5;i++){try{const code=makeCode();const x=await db.query("INSERT INTO family_link_codes(student_id,code,expires_at) VALUES($1,$2,NOW()+INTERVAL '30 days') ON CONFLICT(student_id) DO UPDATE SET code=EXCLUDED.code,created_at=NOW(),expires_at=EXCLUDED.expires_at RETURNING code,expires_at",[user.id,code]);return Response.json({success:true,data:x.rows[0]});}catch(e:any){if(e?.code==="23505")continue;throw e;}}
 throw new Error("code");}catch(e){return Response.json({success:false,error:{message:"Impossible de générer le code."}},{status:500});}
}
