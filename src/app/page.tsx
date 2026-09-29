import type { CSSProperties } from "react";
import Link from "next/link";
import { courses, levels } from "@/lib/data";
import BrandLogo from "@/components/BrandLogo";

const levelMeta: Record<string,string> = {
  "7ème":"Fondations","8ème":"Consolider","9ème":"Maîtriser","1ère":"Progresser","2ème":"Approfondir","3ème":"Performer","Bac":"Réussir"
};

const plans = [
  {name:"ESSENTIEL",price:"0",suffix:"DT",description:"Découvrir EL PROF et commencer son parcours.",features:["Cours découverte","Exercices essentiels","Quiz de niveau","Profil élève"],cta:"Commencer gratuitement"},
  {name:"PLUS",price:"25",suffix:"DT / mois",description:"Un parcours complet pour apprendre et progresser.",features:["Tous les cours","Exercices et quiz","Suivi de progression","Préparation examens","Ressources premium"],cta:"Choisir PLUS",featured:true},
  {name:"PREMIUM FAMILLE",price:"49",suffix:"DT / mois",description:"L'élève apprend. Le parent accompagne.",features:["Tout PLUS","Espace Parent","Résultats et moyennes","Activité et régularité","Rapport hebdomadaire","Classes en direct"],cta:"Choisir PREMIUM FAMILLE"}
];

export default function Home(){
 return <main>
  <section className="hero-premium">
   <div className="hero-premium-copy">
    <div className="hero-kicker"><i/> PLATEFORME ÉDUCATIVE TUNISIENNE · ÉDITION PREMIUM</div>
    <h1>Apprendre le français.<br/><em>Réussir autrement.</em></h1>
    <p>Une expérience pédagogique moderne pour apprendre, pratiquer et progresser du 7ème au Bac — avec des parcours structurés, des quiz et un suivi qui donne du sens aux progrès.</p>
    <div className="hero-actions"><Link href="/connexion?signup=1" className="btn btn-yellow btn-large">Commencer gratuitement →</Link><Link href="#offres" className="btn btn-outline btn-large">Voir les offres</Link></div>
    <div className="hero-proof"><span>✓ <b>Parcours structurés</b></span><span>✓ <b>Suivi de progression</b></span><span>✓ <b>Accessible 24/7</b></span></div>
   </div>
   <div className="hero-premium-art">
    <div className="ep-orbit"/>
    <div className="ep-brand-card"><BrandLogo /><div className="ep-brand-tagline">L&apos;ESPACE D&apos;APPRENTISSAGE</div><strong>Le français,<br/><span>autrement.</span></strong><p>Le français plus simple, plus proche de toi. Une plateforme conçue autour de l'élève et de son parcours.</p></div>
    <div className="ep-float a"><small>PARCOURS</small><b>7 niveaux</b></div>
    <div className="ep-float b"><small>APPRENTISSAGE</small><b>24 / 7</b></div>
    <div className="ep-float c"><b>+ Cours · Quiz · Progression</b></div>
   </div>
  </section>

  <section className="premium-section" id="niveaux">
   <div className="premium-heading"><span className="eyebrow">UN PARCOURS POUR CHAQUE ÉTAPE</span><h2>Du 7ème au Bac, une progression lisible.</h2><p>Chaque niveau possède sa logique d'apprentissage, ses objectifs et ses contenus. L'élève sait où il va et ce qu'il doit travailler.</p></div>
   <div className="premium-levels">{levels.map(level=><Link href={"/cours?level="+encodeURIComponent(level)} className="premium-level" key={level}><strong>{level}</strong><small>{levelMeta[level]}</small></Link>)}</div>
  </section>

  <section className="premium-section" id="apropos">
   <div className="premium-story">
    <div className="story-panel dark"><span className="eyebrow" style={{color:"#ffd21c"}}>UNE PÉDAGOGIE CLAIRE</span><h3>Apprendre n'est pas accumuler du contenu.</h3><p>EL PROF organise l'apprentissage autour d'objectifs, de pratique et de progression visible.</p><div className="story-list"><div className="story-item"><i>01</i><div><b>Comprendre</b><p>Des notions expliquées avec clarté.</p></div></div><div className="story-item"><i>02</i><div><b>Pratiquer</b><p>Des exercices pour transformer la notion en compétence.</p></div></div><div className="story-item"><i>03</i><div><b>Progresser</b><p>Un suivi pour voir les acquis et les prochaines étapes.</p></div></div></div></div>
    <div className="story-panel"><span className="eyebrow">L'EXPÉRIENCE EL PROF</span><h3>Une interface pensée comme un véritable produit EdTech.</h3><p>Une navigation claire, des parcours structurés, des espaces dédiés et une identité visuelle cohérente sur ordinateur comme sur mobile.</p><div className="story-list"><div className="story-item"><i>✓</i><div><b>Espace élève</b><p>Cours, activité, quiz, badges et certificats.</p></div></div><div className="story-item"><i>✓</i><div><b>Espace professeur</b><p>Création et pilotage des parcours pédagogiques.</p></div></div><div className="story-item"><i>✓</i><div><b>Espace parent</b><p>Une vision simple de la progression familiale avec PREMIUM FAMILLE.</p></div></div></div></div>
   </div>
  </section>

  <section className="pricing-wrap" id="offres">
   <div className="premium-heading"><span className="eyebrow">CHOISIR SON EXPÉRIENCE</span><h2>Trois offres. Une même exigence pédagogique.</h2><p>Commence gratuitement, passe à PLUS lorsque tu veux aller plus loin, ou choisis PREMIUM FAMILLE pour intégrer le suivi parental.</p></div>
   <div className="pricing-grid">{plans.map(p=><article className={"price-card"+(p.featured?" featured":"")} key={p.name}>{p.featured&&<span className="price-badge">LE PLUS CHOISI</span>}<span className="eyebrow">{p.name}</span><h3>{p.name==="PREMIUM FAMILLE"?"L'élève + sa famille":p.name==="PLUS"?"Le parcours complet":"Pour commencer"}</h3><p>{p.description}</p><div className="price">{p.price}<small> {p.suffix}</small></div><ul className="price-features">{p.features.map(f=><li key={f}>{f}</li>)}</ul><Link href="/connexion?signup=1" className={"btn "+(p.featured||p.name==="PLUS"?"btn-yellow":"btn-light")+" full"}>{p.cta} →</Link></article>)}</div>
  </section>

  <section className="premium-section">
   <div className="parent-showcase"><div><span className="eyebrow" style={{color:"#9fc1ff"}}>PREMIUM FAMILLE</span><h2>L'élève apprend.<br/>Le parent accompagne.</h2><p>Un espace dédié permet aux parents de suivre les indicateurs essentiels sans entrer dans le travail quotidien de l'élève.</p><div className="parent-points"><div className="parent-point"><span>01</span>Progression des parcours</div><div className="parent-point"><span>02</span>Résultats et moyennes aux quiz</div><div className="parent-point"><span>03</span>Activité et régularité</div><div className="parent-point"><span>04</span>Rapports et objectifs</div></div></div>
    <div className="parent-ui"><div className="parent-ui-top"><div><small>ESPACE PARENT</small><b>Suivi de votre enfant</b></div><span className="status">ACTIF</span></div><div className="parent-child"><div className="parent-child-head"><b>Élève · Parcours français</b><span>EN PROGRESSION</span></div><div className="parent-bars"><div className="parent-bar"><span>Grammaire</span><i style={{"--w":"82%"} as CSSProperties}/><b>82%</b></div><div className="parent-bar"><span>Expression</span><i style={{"--w":"68%"} as CSSProperties}/><b>68%</b></div><div className="parent-bar"><span>Quiz</span><i style={{"--w":"91%"} as CSSProperties}/><b>91%</b></div></div></div><div className="parent-child"><div className="parent-child-head"><b>Cette semaine</b><span>+12%</span></div><small>4 leçons · 3 quiz · progression régulière</small></div></div>
   </div>
  </section>

  <section className="premium-section">
   <div className="premium-heading"><span className="eyebrow">LES COURS EL PROF</span><h2>Des contenus organisés pour produire de vrais progrès.</h2><p>Grammaire, conjugaison, compréhension, expression et préparation aux examens.</p></div>
   <div className="course-grid">{courses.slice(0,6).map(c=><Link href={"/cours/"+c.id} className="course-card" key={c.id}><span className={"course-icon "+c.color}>EP</span><span className="course-level">{c.level}</span><h2>{c.title}</h2><p>{c.description}</p><div className="course-meta"><span>{c.lessons} leçons</span><span>{c.duration}</span></div></Link>)}</div>
  </section>

  <section className="premium-section">
   <div className="final-cta"><div><span className="eyebrow" style={{color:"#ffd21c"}}>PRÊT À COMMENCER ?</span><h2>Ton parcours de français commence ici.</h2><p>Crée ton compte gratuitement et découvre l'expérience EL PROF.</p></div><Link href="/connexion?signup=1" className="btn btn-yellow btn-large">Commencer maintenant →</Link></div>
  </section>
 </main>;
}
