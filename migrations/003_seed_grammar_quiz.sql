BEGIN;

INSERT INTO quizzes (course_id, title, description, passing_score, max_attempts, published)
SELECT c.id, 'Quiz — Les fondamentaux de la grammaire', 'Un premier diagnostic pour vérifier les notions essentielles.', 60, 3, TRUE
FROM courses c
WHERE c.slug='grammaire'
  AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.course_id=c.id AND q.title='Quiz — Les fondamentaux de la grammaire');

INSERT INTO quiz_questions (quiz_id, question, question_type, explanation, points, position)
SELECT q.id, v.question, 'single_choice', v.explanation, 1, v.position
FROM quizzes q
CROSS JOIN (VALUES
  ('Quelle phrase est correctement conjuguée ?', '« Je vais à l''école » est correctement conjuguée au présent.', 0),
  ('Dans « Les élèves travaillent », quel est le sujet ?', 'Le groupe nominal « Les élèves » accomplit l''action.', 1),
  ('Quel mot est un connecteur logique d''opposition ?', '« Cependant » marque une opposition.', 2)
) AS v(question, explanation, position)
WHERE q.title='Quiz — Les fondamentaux de la grammaire'
  AND NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id=q.id);

INSERT INTO quiz_answers (question_id, answer, is_correct, position)
SELECT qq.id, v.answer, v.is_correct, v.position
FROM quiz_questions qq
JOIN quizzes q ON q.id=qq.quiz_id
JOIN LATERAL (
  SELECT * FROM (VALUES
    (0, 'Je vais à l''école.', true), (0, 'Je va à l''école.', false), (0, 'Je vont à l''école.', false), (0, 'Je aller à l''école.', false),
    (1, 'travaillent', false), (1, 'Les élèves', true), (1, 'élèves travaillent', false), (1, 'Les', false),
    (2, 'donc', false), (2, 'car', false), (2, 'cependant', true), (2, 'ainsi', false)
  ) AS a(pos, answer, is_correct)
) v ON v.pos=qq.position
WHERE q.title='Quiz — Les fondamentaux de la grammaire'
  AND NOT EXISTS (SELECT 1 FROM quiz_answers qa WHERE qa.question_id=qq.id);

COMMIT;
