export type CurriculumSource={id:string;title:string;publisher:string;url:string;status:"official";date?:string};
export const CURRICULUM_SOURCES:CurriculumSource[]=[
{id:"po-fr-college-2006",title:"Programmes de français — Cycle préparatoire de l’enseignement de base",publisher:"Ministère de l’Éducation — Direction de la Pédagogie et des Normes",url:"https://www.edunet.tn/ressources/pedagogie/programmes/nouveaux_programme2011/preparatoire/langues/francais_college.pdf",status:"official",date:"Septembre 2006"},
{id:"po-officiels-ministere",title:"Programmes Officiels",publisher:"Ministère de l’Éducation",url:"https://education.gov.tn/?lang=fr&p=500",status:"official"},
];
export const FRENCH_LEVELS=[
{id:"7e",label:"7ème année",cycle:"Deuxième cycle de l’enseignement de base"},
{id:"8e",label:"8ème année",cycle:"Deuxième cycle de l’enseignement de base"},
{id:"9e",label:"9ème année",cycle:"Deuxième cycle de l’enseignement de base"},
{id:"1s",label:"1ère année secondaire",cycle:"Enseignement secondaire"},
{id:"2s",label:"2ème année secondaire",cycle:"Enseignement secondaire"},
{id:"3s",label:"3ème année secondaire",cycle:"Enseignement secondaire"},
{id:"4s",label:"4ème année secondaire",cycle:"Enseignement secondaire"},
];
export const ACTIVITIES=["Oral","Lecture","Compréhension","Écriture","Expression écrite","Langue","Grammaire","Conjugaison","Vocabulaire","Orthographe"];
export const OFFICIAL_COLLEGE_FRAME={
sourceId:"po-fr-college-2006",
components:["Oral","Lecture","Écriture"],
methodologicalThemes:["Approche par compétences","Pédagogie de l’intégration","Pédagogie différenciée","Compétence de communication","Organisation en modules","Pédagogie active centrée sur l’apprenant"],
note:"Cette base ne déduit pas de contenus absents du document source. Les champs non documentés restent à compléter à partir des documents officiels correspondants."
};
