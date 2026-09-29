BEGIN;

CREATE TABLE IF NOT EXISTS ai_course_drafts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  level_code VARCHAR(20) NOT NULL,
  level_label TEXT NOT NULL,
  activity VARCHAR(100) NOT NULL,
  theme TEXT,
  duration INTEGER NOT NULL DEFAULT 60,
  course_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  pedagogical_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','validated','published','archived')),
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  validated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  published_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  validated_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_course_drafts_status ON ai_course_drafts(status);
CREATE INDEX IF NOT EXISTS idx_ai_course_drafts_level ON ai_course_drafts(level_code);

CREATE TABLE IF NOT EXISTS ai_quizzes (
  id BIGSERIAL PRIMARY KEY,
  course_draft_id BIGINT REFERENCES ai_course_drafts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  level_code VARCHAR(20) NOT NULL,
  activity VARCHAR(100) NOT NULL,
  question_count INTEGER NOT NULL DEFAULT 10,
  difficulty VARCHAR(20) NOT NULL DEFAULT 'moyenne',
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','validated','published','archived')),
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  validated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  published_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  validated_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_quizzes_course ON ai_quizzes(course_draft_id);
CREATE INDEX IF NOT EXISTS idx_ai_quizzes_status ON ai_quizzes(status);

COMMIT;