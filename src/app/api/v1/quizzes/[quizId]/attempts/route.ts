import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const user = await getCurrentUser(request);
  if (!user) return Response.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Connexion requise." } }, { status: 401 });
  const { quizId } = await params;
  const id = Number(quizId);
  if (!Number.isInteger(id) || id <= 0) return Response.json({ success: false, error: { code: "INVALID_QUIZ", message: "Quiz invalide." } }, { status: 400 });

  let body: any;
  try { body = await request.json(); } catch { return Response.json({ success: false, error: { code: "INVALID_JSON", message: "Corps JSON invalide." } }, { status: 400 }); }

  try {
    const quizResult = await db.query(
      `SELECT q.id, q.course_id, q.lesson_id, q.passing_score, q.max_attempts
       FROM quizzes q WHERE q.id=$1 AND q.published=true LIMIT 1`, [id]
    );
    if (!quizResult.rowCount) return Response.json({ success: false, error: { code: "QUIZ_NOT_FOUND", message: "Quiz introuvable." } }, { status: 404 });
    const q = quizResult.rows[0];
    const courseId = q.course_id ?? (await db.query(`SELECT m.course_id FROM lessons l JOIN course_modules m ON m.id=l.module_id WHERE l.id=$1`, [q.lesson_id])).rows[0]?.course_id;
    if (!courseId) return Response.json({ success: false, error: { code: "QUIZ_CONFIG_ERROR", message: "Quiz sans cours associé." } }, { status: 500 });

    const enrolled = await db.query(`SELECT 1 FROM enrollments WHERE user_id=$1 AND course_id=$2 LIMIT 1`, [user.id, courseId]);
    if (!enrolled.rowCount) return Response.json({ success: false, error: { code: "NOT_ENROLLED", message: "Inscription au cours requise." } }, { status: 403 });

    const attempts = await db.query(`SELECT COUNT(*)::int AS count FROM quiz_attempts WHERE user_id=$1 AND (quiz_id=$2 OR (quiz_id IS NULL AND quiz_slug=$2::text))`, [user.id, id]);
    if (q.max_attempts && Number(attempts.rows[0].count) >= Number(q.max_attempts)) {
      return Response.json({ success: false, error: { code: "ATTEMPT_LIMIT", message: "Nombre maximal de tentatives atteint." } }, { status: 409 });
    }

    const submitted = body?.answers;
    if (!submitted || typeof submitted !== "object" || Array.isArray(submitted)) {
      return Response.json({ success: false, error: { code: "INVALID_ANSWERS", message: "Réponses invalides." } }, { status: 400 });
    }

    const questions = await db.query(
      `SELECT id, question, question_type, explanation, points, position
       FROM quiz_questions WHERE quiz_id=$1 ORDER BY position`, [id]
    );
    if (!questions.rowCount) return Response.json({ success: false, error: { code: "EMPTY_QUIZ", message: "Ce quiz ne contient aucune question." } }, { status: 422 });

    const answerRows = await db.query(
      `SELECT qa.id, qa.question_id, qa.answer, qa.position, qa.is_correct
       FROM quiz_answers qa
       JOIN quiz_questions qq ON qq.id=qa.question_id WHERE qq.quiz_id=$1
       ORDER BY qa.position`, [id]
    );
    const correctByQuestion = new Map<number, number[]>();
    for (const row of answerRows.rows) {
      if (!correctByQuestion.has(Number(row.question_id))) correctByQuestion.set(Number(row.question_id), []);
      if (row.is_correct) correctByQuestion.get(Number(row.question_id))!.push(Number(row.id));
    }

    let score = 0;
    let total = 0;
    const normalizedAnswers: Record<string, number[]> = {};
    for (const question of questions.rows) {
      const qid = Number(question.id);
      const raw = submitted[String(qid)];
      const selected = (Array.isArray(raw) ? raw : [raw])
        .map(Number).filter(Number.isInteger).filter((value: number) => answerRows.rows.some((a: any) => Number(a.id) === value && Number(a.question_id) === qid));
      const selectedIds = Array.from(new Set(selected)).sort((a,b)=>a-b);
      normalizedAnswers[String(qid)] = selectedIds;
      total += Number(question.points);
      const correctIds = [...(correctByQuestion.get(qid) || [])].sort((a,b)=>a-b);
      if (correctIds.length === selectedIds.length && correctIds.every((value, index) => value === selectedIds[index])) score += Number(question.points);
    }

    const percentage = total ? Math.round((score / total) * 100) : 0;
    const passed = percentage >= Number(q.passing_score);
    const xp = passed ? Math.max(10, Math.round(percentage * 1.5)) : Math.max(5, Math.round(percentage));

    const corrections = questions.rows.map((question: any) => {
      const qid = Number(question.id);
      const selectedIds = normalizedAnswers[String(qid)] || [];
      const choices = answerRows.rows
        .filter((row: any) => Number(row.question_id) === qid)
        .map((row: any) => ({
          id: Number(row.id),
          answer: row.answer,
          isCorrect: Boolean(row.is_correct),
          selected: selectedIds.includes(Number(row.id)),
        }));
      const correctIds = choices.filter((choice: any) => choice.isCorrect).map((choice: any) => choice.id).sort((a:number,b:number)=>a-b);
      const selectedSorted = [...selectedIds].sort((a,b)=>a-b);
      const correct = correctIds.length === selectedSorted.length && correctIds.every((value:number,index:number)=>value===selectedSorted[index]);
      return {
        id: qid,
        question: question.question,
        explanation: question.explanation,
        points: Number(question.points),
        correct,
        choices,
      };
    });

    const client = await db.connect();
    try {
      await client.query("BEGIN");
      const attempt = await client.query(
        `INSERT INTO quiz_attempts(user_id, quiz_id, quiz_slug, score, total, xp_gained, percentage, passed, answers, completed_at)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,NOW())
         RETURNING id, quiz_id, score, total, percentage, passed, xp_gained, created_at, completed_at`,
        [user.id, id, String(id), score, total, xp, percentage, passed, JSON.stringify(normalizedAnswers)]
      );
      await client.query(`UPDATE users SET xp=xp+$1, updated_at=NOW() WHERE id=$2`, [xp, user.id]);
      await client.query("COMMIT");
      return Response.json({ success: true, data: { ...attempt.rows[0], percentage, passed, xpGained: xp, corrections } });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally { client.release(); }
  } catch (error) {
    console.error("quiz-attempt", error);
    return Response.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Impossible d'enregistrer la tentative." } }, { status: 500 });
  }
}
