export type Course = {
  id: string;
  title: string;
  level: string;
  category: string;
  description: string;
  lessons: number;
  duration: string;
  color: string;
};

export const levels = ["7ème", "8ème", "9ème", "1ère", "2ème", "3ème", "Bac"];

export const courses: Course[] = [
  { id: "grammaire", title: "Grammaire essentielle", level: "7ème → 9ème", category: "Grammaire", description: "Les notions indispensables expliquées simplement avec exercices progressifs.", lessons: 18, duration: "4h 20", color: "blue" },
  { id: "conjugaison", title: "Maîtriser la conjugaison", level: "7ème → Bac", category: "Conjugaison", description: "Temps, modes, accords et entraînement guidé.", lessons: 22, duration: "5h 10", color: "yellow" },
  { id: "comprehension", title: "Compréhension écrite", level: "7ème → 3ème", category: "Compréhension", description: "Lire, comprendre, relever les indices et répondre efficacement.", lessons: 15, duration: "3h 45", color: "purple" },
  { id: "expression", title: "Expression écrite", level: "8ème → Bac", category: "Expression", description: "Méthodes, plans, paragraphes, argumentation et rédaction.", lessons: 20, duration: "4h 50", color: "green" },
  { id: "dissertation", title: "La dissertation", level: "Bac", category: "Préparation Bac", description: "Méthode complète : analyser, problématiser, construire et rédiger.", lessons: 12, duration: "3h 15", color: "red" },
  { id: "revision-bac", title: "Révisions Bac Français", level: "Bac", category: "Examens", description: "Parcours intensif avec fiches, exercices et quiz.", lessons: 30, duration: "8h 30", color: "blue" }
];

export const lessonSteps = [
  "Analyser le sujet",
  "Construire un plan",
  "Rédiger l’introduction",
  "Développer les parties",
  "Conclure"
];

export const quizQuestions = [
  {
    question: "Quelle phrase est correctement conjuguée ?",
    choices: ["Je vais à l'école.", "Je va à l'école.", "Je vont à l'école.", "Je aller à l'école."],
    answer: 0
  },
  {
    question: "Dans « Les élèves travaillent », quel est le sujet ?",
    choices: ["travaillent", "Les élèves", "élèves travaillent", "Les"],
    answer: 1
  },
  {
    question: "Quel mot est un connecteur logique d'opposition ?",
    choices: ["donc", "car", "cependant", "ainsi"],
    answer: 2
  }
];
