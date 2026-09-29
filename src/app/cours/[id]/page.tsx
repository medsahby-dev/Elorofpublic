import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import CoursePlayer from "./CoursePlayer";

export const dynamic = "force-dynamic";

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await db.query(`SELECT id, slug, title, description, level, category, access, lessons, duration FROM courses WHERE slug=$1 AND published=true LIMIT 1`, [id]);
  if (!result.rowCount) notFound();
  return <CoursePlayer slug={id} initialCourse={result.rows[0]} />;
}
