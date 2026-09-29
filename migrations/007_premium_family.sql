BEGIN;

CREATE TABLE IF NOT EXISTS subscription_plans (
  code VARCHAR(40) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price_monthly NUMERIC(8,2) NOT NULL DEFAULT 0,
  description TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_code VARCHAR(40) NOT NULL REFERENCES subscription_plans(code),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','trialing','cancelled','expired')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_status ON user_subscriptions(user_id,status);

CREATE TABLE IF NOT EXISTS parent_student_links (
  parent_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('pending','active','revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(parent_id,student_id),
  CHECK(parent_id <> student_id)
);

CREATE INDEX IF NOT EXISTS idx_parent_student_links_student ON parent_student_links(student_id,status);

CREATE TABLE IF NOT EXISTS family_link_codes (
  student_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(16) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days'
);

INSERT INTO subscription_plans(code,name,price_monthly,description,features)
VALUES
('essential','ESSENTIEL',0,'Pour découvrir EL PROF.','["Cours découverte","Exercices essentiels","Quiz de niveau","Profil élève"]'::jsonb),
('plus','PLUS',25,'Pour suivre un parcours complet.','["Tous les cours","Exercices et quiz","Suivi de progression","Préparation examens","Ressources premium"]'::jsonb),
('premium_famille','PREMIUM FAMILLE',49,'Pour apprendre et accompagner la progression.','["Tout PLUS","Espace Parent","Suivi de progression","Résultats et moyennes","Activité et régularité","Rapport hebdomadaire","Classes en direct"]'::jsonb)
ON CONFLICT(code) DO UPDATE SET name=EXCLUDED.name,price_monthly=EXCLUDED.price_monthly,description=EXCLUDED.description,features=EXCLUDED.features,active=TRUE;

COMMIT;
