BEGIN;

ALTER TABLE quiz_attempts
  ADD COLUMN IF NOT EXISTS quiz_id BIGINT REFERENCES quizzes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS percentage INTEGER CHECK (percentage IS NULL OR percentage BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS passed BOOLEAN,
  ADD COLUMN IF NOT EXISTS answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_quiz
  ON quiz_attempts(user_id, quiz_id, created_at DESC);

-- Backfill legacy attempts when their quiz_slug contains the numeric quiz id.
UPDATE quiz_attempts qa
SET quiz_id = q.id
FROM quizzes q
WHERE qa.quiz_id IS NULL AND qa.quiz_slug = q.id::text;

COMMIT;
