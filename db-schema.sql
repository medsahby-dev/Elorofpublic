-- EL PROF V2 - PostgreSQL foundation
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student','teacher','parent','admin')),
  level VARCHAR(80),
  objective VARCHAR(160),
  subscription VARCHAR(30) NOT NULL DEFAULT 'free',
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  level VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  access VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (access IN ('free','premium')),
  lessons INTEGER NOT NULL DEFAULT 0,
  duration VARCHAR(50),
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS live_classes (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,
  teacher_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  room_id VARCHAR(180) NOT NULL UNIQUE,
  provider VARCHAR(30) NOT NULL DEFAULT 'jitsi' CHECK (provider IN ('jitsi','bigbluebutton')),
  recording_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','finished','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_slug VARCHAR(120) NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  xp_gained INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_classes_starts_at ON live_classes(starts_at);
CREATE INDEX IF NOT EXISTS idx_live_classes_status ON live_classes(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);

INSERT INTO courses (slug,title,description,level,category,access,lessons,duration,published)
VALUES
('grammaire','Grammaire essentielle','Les notions indispensables expliquées simplement avec exercices progressifs.','7ème → 9ème','Grammaire','free',18,'4h 20',true),
('conjugaison','Maîtriser la conjugaison','Temps, modes, accords et entraînement guidé.','7ème → Bac','Conjugaison','free',22,'5h 10',true),
('comprehension','Compréhension écrite','Lire, comprendre, relever les indices et répondre efficacement.','7ème → 3ème','Compréhension','premium',15,'3h 45',true),
('expression','Expression écrite','Méthodes, plans, paragraphes, argumentation et rédaction.','8ème → Bac','Expression','premium',20,'4h 50',true),
('dissertation','La dissertation','Méthode complète : analyser, problématiser, construire et rédiger.','Bac','Préparation Bac','premium',12,'3h 15',true),
('revision-bac','Révisions Bac Français','Parcours intensif avec fiches, exercices et quiz.','Bac','Examens','premium',30,'8h 30',true)
ON CONFLICT (slug) DO NOTHING;
