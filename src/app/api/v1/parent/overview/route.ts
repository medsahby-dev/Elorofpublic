import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

export const runtime="nodejs";
export const dynamic="force-dynamic";

async function premiumParent(user:any){
  const r=await db.query("SELECT COALESCE((SELECT sp.code FROM user_subscriptions us JOIN subscription_plans sp ON sp.code=us.plan_code WHERE us.user_id=$1 AND us.status IN ('active','trialing') AND (us.expires_at IS NULL OR us.expires_at>NOW()) ORDER BY us.started_at DESC LIMIT 1),CASE WHEN LOWER(COALESCE($2,'')) IN ('premium','premium_famille','family') THEN 'premium_famille' ELSE 'essential' END) code",[user.id,user.subscription]);
  return r.rows[0]?.code==="premium_famille";
}

export async function GET(request:Request){
  const user=await getCurrentUser(request);
  if(!user)return Response.json({success:false,error:{code:"UNAUTHENTICATED",message:"Connexion requise."}},{status:401});
  if(user.role!=="parent")return Response.json({success:false,error:{code:"FORBIDDEN",message:"Accès réservé aux parents."}},{status:403});
  try{
    if(!(await premiumParent(user)))return Response.json({success:false,error:{code:"PREMIUM_REQUIRED",message:"Le suivi parental est inclus dans PREMIUM FAMILLE."}},{status:402});
    const children=await db.query(
      "SELECT u.id,u.first_name,u.last_name,u.level,"+
      "COALESCE((SELECT ROUND(AVG(cp.progress))::int FROM course_progress cp WHERE cp.user_id=u.id),0)::int AS progress,"+
      "(SELECT COUNT(*)::int FROM course_progress cp WHERE cp.user_id=u.id AND cp.progress=100) AS completed_courses,"+
      "(SELECT COUNT(*)::int FROM lesson_progress lp WHERE lp.user_id=u.id AND lp.status='completed') AS completed_lessons,"+
      "(SELECT COUNT(*)::int FROM quiz_attempts qa WHERE qa.user_id=u.id) AS quiz_attempts,"+
      "COALESCE((SELECT ROUND(AVG(qa.percentage))::int FROM quiz_attempts qa WHERE qa.user_id=u.id AND qa.percentage IS NOT NULL),0)::int AS average_quiz,"+
      "(SELECT MAX(lp.last_seen_at) FROM lesson_progress lp WHERE lp.user_id=u.id) AS last_activity "+
      "FROM parent_student_links psl JOIN users u ON u.id=psl.student_id "+
      "WHERE psl.parent_id=$1 AND psl.status='active' AND u.role='student' ORDER BY u.first_name,u.last_name",[user.id]);
    const ids=children.rows.map((x:any)=>Number(x.id));
    let courses:any[]=[];let activity:any[]=[];
    if(ids.length){
      const c=await db.query("SELECT cp.user_id,c.title,cp.progress,cp.completed_lessons,cp.total_lessons FROM course_progress cp JOIN courses c ON c.id=cp.course_id WHERE cp.user_id=ANY($1::bigint[]) ORDER BY cp.last_seen_at DESC LIMIT 20",[ids]);
      const a=await db.query("SELECT lp.user_id,l.title,c.title AS course_title,lp.status,lp.progress,lp.last_seen_at FROM lesson_progress lp JOIN lessons l ON l.id=lp.lesson_id JOIN course_modules m ON m.id=l.module_id JOIN courses c ON c.id=m.course_id WHERE lp.user_id=ANY($1::bigint[]) ORDER BY lp.last_seen_at DESC LIMIT 15",[ids]);
      courses=c.rows;activity=a.rows;
    }
    return Response.json({success:true,data:{parent:{firstName:user.first_name,lastName:user.last_name,plan:"premium_famille"},children:children.rows,courses,activity}});
  }catch(e){console.error("parent-overview",e);return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de charger le suivi parental."}},{status:500});}
}

export async function POST(request:Request){
  const user=await getCurrentUser(request);
  if(!user)return Response.json({success:false,error:{code:"UNAUTHENTICATED",message:"Connexion requise."}},{status:401});
  if(user.role!=="parent")return Response.json({success:false,error:{code:"FORBIDDEN",message:"Accès réservé aux parents."}},{status:403});
  try{
    if(!(await premiumParent(user)))return Response.json({success:false,error:{code:"PREMIUM_REQUIRED",message:"Le suivi parental est inclus dans PREMIUM FAMILLE."}},{status:402});
    const body=await request.json();const code=String(body?.code||"").trim().toUpperCase();
    if(!/^[A-Z0-9]{8}$/.test(code))return Response.json({success:false,error:{code:"INVALID_CODE",message:"Code famille invalide."}},{status:400});
    const r=await db.query("SELECT fl.student_id,u.first_name,u.last_name FROM family_link_codes fl JOIN users u ON u.id=fl.student_id WHERE fl.code=$1 AND fl.expires_at>NOW() AND u.role='student'",[code]);
    if(!r.rowCount)return Response.json({success:false,error:{code:"INVALID_CODE",message:"Code introuvable ou expiré."}},{status:404});
    const student=r.rows[0];
    await db.query("INSERT INTO parent_student_links(parent_id,student_id,status) VALUES($1,$2,'active') ON CONFLICT(parent_id,student_id) DO UPDATE SET status='active'",[user.id,student.student_id]);
    return Response.json({success:true,data:{student}});
  }catch(e){console.error("parent-link",e);return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de rattacher cet élève."}},{status:500});}
}
