BEGIN;

-- EL PROF V3.1 — Learning Engine foundation
-- Compatible with the existing BIGSERIAL-based V2 schema.

CREATE TABLE IF NOT EXISTS course_modules (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  position INTEGER NOT NULL CHECK (position >= 0),
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (course_id, position)
);

CREATE TABLE IF NOT EXISTS lessons (
  id BIGSERIAL PRIMARY KEY,
  module_id BIGINT NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  description TEXT,
  content TEXT,
  lesson_type VARCHAR(30) NOT NULL DEFAULT 'text'
    CHECK (lesson_type IN ('text','video','audio','pdf','interactive','quiz','assignment')),
  duration_minutes INTEGER CHECK (duration_minutes IS NULL OR duration_minutes >= 0),
  position INTEGER NOT NULL CHECK (position >= 0),
  is_preview BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (module_id, position),
  UNIQUE (module_id, slug)
);

CREATE TABLE IF NOT EXISTS lesson_resources (
  id BIGSERIAL PRIMARY KEY,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  resource_type VARCHAR(30) NOT NULL
    CHECK (resource_type IN ('pdf','document','image','audio','video','link','download')),
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quizzes (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  passing_score INTEGER NOT NULL DEFAULT 50 CHECK (passing_score BETWEEN 0 AND 100),
  max_attempts INTEGER CHECK (max_attempts IS NULL OR max_attempts > 0),
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (course_id IS NOT NULL OR lesson_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id BIGSERIAL PRIMARY KEY,
  quiz_id BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type VARCHAR(30) NOT NULL DEFAULT 'single_choice'
    CHECK (question_type IN ('single_choice','multiple_choice','true_false','short_answer','fill_blank','matching','ordering')),
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 1 CHECK (points > 0),
  position INTEGER NOT NULL CHECK (position >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (quiz_id, position)
);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (question_id, position)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started','in_progress','completed')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS course_progress (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  completed_lessons INTEGER NOT NULL DEFAULT 0 CHECK (completed_lessons >= 0),
  total_lessons INTEGER NOT NULL DEFAULT 0 CHECK (total_lessons >= 0),
  last_lesson_id BIGINT REFERENCES lessons(id) ON DELETE SET NULL,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_course_modules_course_position
  ON course_modules(course_id, position);
CREATE INDEX IF NOT EXISTS idx_lessons_module_position
  ON lessons(module_id, position);
CREATE INDEX IF NOT EXISTS idx_lesson_resources_lesson_position
  ON lesson_resources(lesson_id, position);
CREATE INDEX IF NOT EXISTS idx_quizzes_course
  ON quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson
  ON quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_position
  ON quiz_questions(quiz_id, position);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_question_position
  ON quiz_answers(question_id, position);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user
  ON lesson_progress(user_id, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_progress_user
  ON course_progress(user_id, last_seen_at DESC);

-- Seed a small real curriculum for existing courses only when they have no modules.
INSERT INTO course_modules (course_id, title, description, position, published)
SELECT c.id, 'Module 1 — Fondations', 'Les notions essentielles pour commencer le parcours.', 0, TRUE
FROM courses c
WHERE c.slug IN ('grammaire','conjugaison','comprehension','expression','dissertation','revision-bac')
  AND NOT EXISTS (SELECT 1 FROM course_modules m WHERE m.course_id = c.id);

INSERT INTO lessons (module_id, title, slug, description, content, lesson_type, duration_minutes, position, is_preview, published)
SELECT m.id,
       CASE c.slug
         WHEN 'grammaire' THEN 'Comprendre les notions essentielles'
         WHEN 'conjugaison' THEN 'Identifier les temps et les modes'
         WHEN 'comprehension' THEN 'Lire et repérer les informations clés'
         WHEN 'expression' THEN 'Construire une expression claire'
         WHEN 'dissertation' THEN 'Analyser le sujet'
         WHEN 'revision-bac' THEN 'Diagnostiquer son niveau'
         ELSE 'Introduction au parcours'
       END,
       'introduction',
       'Première étape du parcours EL PROF.',
       'Cette leçon constitue le point de départ du parcours. Le contenu éditorial sera enrichi progressivement depuis le Course Builder.',
       'text',
       20,
       0,
       TRUE,
       TRUE
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE m.position = 0
  AND NOT EXISTS (SELECT 1 FROM lessons l WHERE l.module_id = m.id);

COMMIT;
