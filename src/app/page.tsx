import Image from "next/image";
import type { CSSProperties } from "react";
import Link from "next/link";
import { courses, levels } from "@/lib/data";
import BrandLogo from "@/components/BrandLogo";

const levelMeta: Record<string,string> = {
  "7ème":"Consolider les bases","8ème":"Gagner en autonomie","9ème":"Se préparer au lycée","1ère":"Construire ses compétences","2ème":"Approfondir et réussir","3ème":"Vers l’excellence","Bac":"Objectif réussite"
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
    <h1>Le français<br/>plus simple,<br/><em>plus proche de toi !</em></h1>
    <p>Des cours interactifs, des quiz, des classes en direct et un suivi personnalisé pour progresser du 7ème au Bac avec confiance.</p>
    <div className="hero-actions"><Link href="/connexion?signup=1" className="btn btn-yellow btn-large">Commencer gratuitement →</Link><Link href="#apropos" className="btn btn-outline btn-large">▶ Voir la méthode</Link></div>
    <div className="hero-proof"><span>◉ <b>Cours vidéo de qualité</b></span><span>◉ <b>Classes en direct</b></span><span>◉ <b>Quiz interactifs</b></span><span>◉ <b>Suivi personnalisé</b></span></div>
   </div>
   <div className="hero-premium-art v51-hero-art">
    <div className="v51-photo-wrap">
      <Image src="https://images.pexels.com/photos/8199167/pexels-photo-8199167.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Élève utilisant EL PROF" fill sizes="(max-width: 900px) 100vw, 48vw" className="v51-student-photo" priority />
      <div className="v51-photo-gradient" />
    </div>
    <div className="v51-logo-wrap">
      <Image src="/elprof-logo.webp" alt="EL PROF" width={390} height={390} className="v51-official-logo" priority />
    </div>
    <div className="v51-speech">Apprendre<br/><b>Réussir</b><br/>Grandir <span>↗</span></div>
    <div className="v51-stat-card"><div className="v51-stat-icon">▥</div><div><strong>+95%</strong><small>de réussite</small></div><div className="v51-avatars">● ● ● ●</div><b>+10 000</b><small>élèves nous font confiance</small></div>
   </div>
  </section>

  <section className="premium-section reveal-section" id="niveaux">
   <div className="v52-section-heading"><div><h2>Nos niveaux</h2><span className="v52-yellow-underline"/></div><p>Un parcours complet du 7ème au Bac</p><span className="v52-heading-action">Choisis ton niveau et commence dès aujourd’hui ! <b>←</b><b>→</b></span></div>
   <div className="premium-levels stagger-grid">{levels.map((level,i)=><Link href={"/cours?level="+encodeURIComponent(level)} className={"premium-level level-"+(i+1)} key={level}><span className="level-orb" aria-hidden="true">{i+1}</span><div><strong>{level}</strong><small>{levelMeta[level]}</small></div><span className="level-arrow" aria-hidden="true">↗</span></Link>)}</div>
  </section>

    </section>

  <section className="pricing-wrap reveal-section" id="offres">
   <div className="v52-offers-heading"><div><h2>Nos offres</h2><span className="v52-yellow-underline"/></div><p>Des formules adaptées à tous les besoins</p><div className="v52-billing"><b>Mensuel</b><span>Annuel</span><i>-20%</i></div><div className="v52-save-note">Économisez<br/>jusqu’à 20% !<br/><b>↘</b></div></div>
   <div className="pricing-grid stagger-grid">{plans.map((p,i)=><article className={"price-card plan-"+(i+1)+(p.featured?" featured":"")} key={p.name}>{p.featured&&<span className="price-badge">LE PLUS CHOISI</span>}<div className={"price-photo photo-"+(i+1)} aria-hidden="true"><span className="photo-shade"/><span className="photo-kicker">{i===0?"COMMENCE À TON RYTHME":i===1?"ACCÉLÈRE TA RÉUSSITE":"APPRENDS EN FAMILLE"}</span></div><span className="eyebrow">{p.name}</span><h3>{p.name==="PREMIUM FAMILLE"?"L'élève + sa famille":p.name==="PLUS"?"Le parcours complet":"Pour commencer"}</h3><p>{p.description}</p><div className="price-block"><span className="price-label">{p.price==="0"?"ACCÈS GRATUIT":"ABONNEMENT"}</span><div className="price"><strong>{p.price}</strong><small>{p.suffix}</small></div></div><ul className="price-features">{p.features.map(f=><li key={f}>{f}</li>)}</ul><Link href="/connexion?signup=1" className={"btn "+(p.featured||p.name==="PLUS"?"btn-yellow":"btn-light")+" full"}>{p.cta} →</Link></article>)}</div>
  </section>

<section className="premium-section reveal-section" id="apropos">
   <div className="premium-story">
    <div className="story-panel dark"><span className="eyebrow" style={{color:"#ffd21c"}}>UNE PÉDAGOGIE CLAIRE</span><h3>Apprendre n'est pas accumuler du contenu.</h3><p>EL PROF organise l'apprentissage autour d'objectifs, de pratique et de progression visible.</p><div className="story-list"><div className="story-item"><i>01</i><div><b>Comprendre</b><p>Des notions expliquées avec clarté.</p></div></div><div className="story-item"><i>02</i><div><b>Pratiquer</b><p>Des exercices pour transformer la notion en compétence.</p></div></div><div className="story-item"><i>03</i><div><b>Progresser</b><p>Un suivi pour voir les acquis et les prochaines étapes.</p></div></div></div></div>
    <div className="story-panel"><span className="eyebrow">L'EXPÉRIENCE EL PROF</span><h3>Une interface pensée comme un véritable produit EdTech.</h3><p>Une navigation claire, des parcours structurés, des espaces dédiés et une identité visuelle cohérente sur ordinateur comme sur mobile.</p><div className="story-list"><div className="story-item"><i>✓</i><div><b>Espace élève</b><p>Cours, activité, quiz, badges et certificats.</p></div></div><div className="story-item"><i>✓</i><div><b>Espace professeur</b><p>Création et pilotage des parcours pédagogiques.</p></div></div><div className="story-item"><i>✓</i><div><b>Espace parent</b><p>Une vision simple de la progression familiale avec PREMIUM FAMILLE.</p></div></div></div></div>
   </div>


  <section className="v5-trust" aria-label="Les engagements EL PROF">
    <div><span className="v5-trust-icon">🏆</span><b>Des résultats concrets</b><small>du 7ème au Bac</small></div>
    <div><span className="v5-trust-icon">👨‍👩‍👦</span><b>Une vraie relation</b><small>élève · parent · professeur</small></div>
    <div><span className="v5-trust-icon">✦</span><b>Une méthode structurée</b><small>simple et progressive</small></div>
    <div><span className="v5-trust-icon">♥</span><b>Une équipe passionnée</b><small>toujours à tes côtés</small></div>
  </section>

  <section className="premium-section">
   <div className="parent-showcase"><div><span className="eyebrow" style={{color:"#9fc1ff"}}>PREMIUM FAMILLE</span><h2>L'élève apprend.<br/>Le parent accompagne.</h2><p>Un espace dédié permet aux parents de suivre les indicateurs essentiels sans entrer dans le travail quotidien de l'élève.</p><div className="parent-points"><div className="parent-point"><span>01</span>Progression des parcours</div><div className="parent-point"><span>02</span>Résultats et moyennes aux quiz</div><div className="parent-point"><span>03</span>Activité et régularité</div><div className="parent-point"><span>04</span>Rapports et objectifs</div></div></div>
    <div className="parent-ui"><div className="parent-ui-top"><div><small>ESPACE PARENT</small><b>Suivi de votre enfant</b></div><span className="status">ACTIF</span></div><div className="parent-child"><div className="parent-child-head"><b>Élève · Parcours français</b><span>EN PROGRESSION</span></div><div className="parent-bars"><div className="parent-bar"><span>Grammaire</span><i style={{"--w":"82%"} as CSSProperties}/><b>82%</b></div><div className="parent-bar"><span>Expression</span><i style={{"--w":"68%"} as CSSProperties}/><b>68%</b></div><div className="parent-bar"><span>Quiz</span><i style={{"--w":"91%"} as CSSProperties}/><b>91%</b></div></div></div><div className="parent-child"><div className="parent-child-head"><b>Cette semaine</b><span>+12%</span></div><small>4 leçons · 3 quiz · progression régulière</small></div></div>
   </div>
  </section>

  <section className="premium-section">
   <div className="premium-heading"><span className="eyebrow">LES COURS EL PROF</span><h2>Des contenus organisés pour produire de vrais progrès.</h2><p>Grammaire, conjugaison, compréhension, expression et préparation aux examens.</p></div>
   <div className="course-grid stagger-grid">{courses.slice(0,6).map(c=><Link href={"/cours/"+c.id} className="course-card" key={c.id}><span className={"course-icon "+c.color}>EP</span><span className="course-level">{c.level}</span><h2>{c.title}</h2><p>{c.description}</p><div className="course-meta"><span>{c.lessons} leçons</span><span>{c.duration}</span></div></Link>)}</div>
  </section>

  <section className="premium-section">
   <div className="final-cta"><div><span className="eyebrow" style={{color:"#ffd21c"}}>PRÊT À COMMENCER ?</span><h2>Ton parcours de français commence ici.</h2><p>Crée ton compte gratuitement et découvre l'expérience EL PROF.</p></div><Link href="/connexion?signup=1" className="btn btn-yellow btn-large">Commencer maintenant →</Link></div>
  </section>
 </main>;
}
