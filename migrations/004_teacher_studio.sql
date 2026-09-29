BEGIN;

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS teacher_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','in_review','published','archived'));

UPDATE courses
SET status = CASE WHEN published THEN 'published' ELSE 'draft' END
WHERE status IS NULL OR status NOT IN ('draft','in_review','published','archived');

CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

-- Associate existing courses with the first teacher when available, without changing published content.
UPDATE courses c
SET teacher_id = u.id
FROM (SELECT id FROM users WHERE role='teacher' ORDER BY id LIMIT 1) u
WHERE c.teacher_id IS NULL;

COMMIT;
