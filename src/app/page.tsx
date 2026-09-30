import Link from "next/link";
import { courses, levels } from "@/lib/data";

const levelMeta: Record<string,string> = {
  "7ème":"Consolider les bases","8ème":"Gagner en autonomie","9ème":"Se préparer au lycée",
  "1ère":"Construire ses compétences","2ème":"Approfondir et réussir","3ème":"Vers l’excellence","Bac":"Objectif réussite"
};

const plans = [
  {name:"ESSENTIEL",price:"0",suffix:"DT",tag:"POUR COMMENCER",description:"Découvre EL PROF et construis tes premières habitudes.",features:["Cours découverte","Exercices essentiels","Quiz de niveau","Profil élève"]},
  {name:"PLUS",price:"25",suffix:"DT / mois",tag:"LE PARCOURS COMPLET",description:"Tout ce qu’il faut pour apprendre, pratiquer et progresser.",features:["Tous les cours","Exercices et quiz","Suivi de progression","Préparation examens","Ressources premium"],featured:true},
  {name:"PREMIUM FAMILLE",price:"49",suffix:"DT / mois",tag:"L’ÉLÈVE + LA FAMILLE",description:"L’élève apprend. Le parent accompagne avec une vision claire.",features:["Tout PLUS","Espace Parent","Résultats et moyennes","Activité et régularité","Rapport hebdomadaire","Classes en direct"]}
];

function Arrow(){return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M10 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function Check(){return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 3.2 3.2L16 5.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}

export default function Home(){
 return <main className="ultra-home">
  <section className="ultra-hero">
    <div className="hero-glow hero-glow-a"/><div className="hero-glow hero-glow-b"/>
    <div className="hero-gridline"/>
    <div className="ultra-hero-copy">
      <div className="ultra-pill"><span/> PLATEFORME ÉDUCATIVE · TUNISIE</div>
      <h1>Le français,<br/><em>autrement.</em></h1>
      <p>Une expérience d’apprentissage pensée pour comprendre, pratiquer et progresser — du 7ème au Bac.</p>
      <div className="ultra-actions">
        <Link href="/connexion?signup=1" className="ultra-btn ultra-btn-yellow">Commencer maintenant <Arrow/></Link>
        <Link href="#niveaux" className="ultra-btn ultra-btn-ghost">Explorer les parcours</Link>
      </div>
      <div className="ultra-proof"><span><b>7ème → Bac</b> parcours structurés</span><span><b>Élève · Parent · Professeur</b> un écosystème</span></div>
    </div>
    <div className="ultra-hero-visual">
      <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
      <div className="hero-card hero-card-main">
        <div className="hero-card-top"><span className="mini-brand">EP</span><span className="live-dot">PARCOURS ACTIF</span></div>
        <div className="hero-card-label">TON ESPACE D’APPRENTISSAGE</div>
        <strong>Français · 9ème</strong>
        <p>Comprendre les relations entre les personnages</p>
        <div className="hero-progress"><span style={{width:"78%"}}/></div>
        <div className="hero-card-meta"><span>78% maîtrisé</span><span>4 / 5 activités</span></div>
      </div>
      <div className="hero-float hero-float-a"><small>PROGRESSION</small><b>+24%</b><span>ce mois-ci</span></div>
      <div className="hero-float hero-float-b"><span className="float-icon">✦</span><div><b>Quiz validé</b><small>Score 92%</small></div></div>
      <div className="hero-logo-card" aria-label="Logo EL PROF"><img src="/favicon.svg" alt="EL PROF — Le français plus simple, plus proche de toi" /></div>
    </div>
    <div className="hero-bottom-note"><span>SCROLL POUR DÉCOUVRIR</span><i/></div>
  </section>

  <section className="ultra-section ultra-intro">
    <div className="section-kicker">UNE MÉTHODE. UNE EXPÉRIENCE.</div>
    <div className="intro-grid">
      <h2>Apprendre n’est pas<br/><em>accumuler du contenu.</em></h2>
      <div><p>EL PROF transforme le cours de français en un parcours clair, progressif et mesurable.</p><Link href="#apropos" className="text-link">Découvrir notre approche <Arrow/></Link></div>
    </div>
    <div className="method-cards">
      <article><span>01</span><h3>Comprendre</h3><p>Des notions expliquées avec précision et simplicité.</p></article>
      <article><span>02</span><h3>Pratiquer</h3><p>Des exercices conçus pour transformer la notion en compétence.</p></article>
      <article><span>03</span><h3>Progresser</h3><p>Une progression visible, des objectifs et des repères.</p></article>
    </div>
  </section>

  <section className="ultra-section levels-section" id="niveaux">
    <div className="ultra-heading-row"><div><div className="section-kicker">TON PARCOURS</div><h2>Du 7ème au Bac.</h2></div><p>Choisis ton niveau.<br/>Commence là où tu es.</p></div>
    <div className="ultra-levels">{levels.map((level,i)=><Link href={"/cours?level="+encodeURIComponent(level)} className="ultra-level" key={level}><span className="level-number">0{i+1}</span><div><b>{level}</b><small>{levelMeta[level]}</small></div><Arrow/></Link>)}</div>
  </section>

  <section className="ultra-section dark-section" id="apropos">
    <div className="section-kicker">L’EXPÉRIENCE EL PROF</div>
    <div className="dark-intro"><h2>Une plateforme qui donne<br/><em>envie d’avancer.</em></h2><p>Chaque écran est pensé pour réduire la friction, mettre l’essentiel au premier plan et rendre la progression visible.</p></div>
    <div className="experience-grid">
      <div className="experience-large"><span>ESPACE ÉLÈVE</span><h3>Tout ton parcours.<br/>Au même endroit.</h3><div className="fake-dashboard"><div className="fake-sidebar"/><div className="fake-main"><i/><i/><i/></div></div></div>
      <div className="experience-small"><span>ESPACE PROFESSEUR</span><h3>Créer.<br/>Piloter.<br/>Faire progresser.</h3><b>Studio pédagogique →</b></div>
      <div className="experience-small family"><span>PREMIUM FAMILLE</span><h3>L’élève apprend.<br/>Le parent accompagne.</h3><b>Suivi intelligent →</b></div>
    </div>
  </section>

  <section className="pricing-wrap ultra-pricing" id="offres">
    <div className="ultra-section pricing-inner">
      <div className="ultra-heading-row"><div><div className="section-kicker">DES OFFRES SIMPLES</div><h2>Choisis ton rythme.</h2></div><p>Commence gratuitement.<br/>Passe au niveau supérieur quand tu veux.</p></div>
      <div className="ultra-pricing-grid">{plans.map((p,i)=><article className={"ultra-price-card "+(p.featured?"featured":"")} key={p.name}>{p.featured&&<div className="popular">LE PLUS CHOISI</div>}<div className="price-top"><span>{p.tag}</span><b>0{i+1}</b></div><h3>{p.name==="PREMIUM FAMILLE" ? <>L’élève +<br/>sa famille</> : p.name==="PLUS" ? <>Le parcours<br/>complet</> : <>Pour<br/>commencer</>}</h3><p>{p.description}</p><div className="price-value"><strong>{p.price}</strong><small>{p.suffix}</small></div><ul>{p.features.map(f=><li key={f}><Check/>{f}</li>)}</ul><Link href="/connexion?signup=1" className={"ultra-price-btn "+(p.featured?"yellow":"dark")}>{p.price==="0"?"Commencer":"Choisir "+(p.name==="PREMIUM FAMILLE"?"Famille":p.name)} <Arrow/></Link></article>)}</div>
    </div>
  </section>

  <section className="ultra-section courses-section">
    <div className="ultra-heading-row"><div><div className="section-kicker">LES COURS</div><h2>Des contenus qui font progresser.</h2></div><Link href="/cours" className="text-link">Voir tous les cours <Arrow/></Link></div>
    <div className="ultra-course-grid">{courses.slice(0,6).map((c,i)=><Link href={"/cours/"+c.slug} className="ultra-course" key={c.id}><span className="course-index">0{i+1}</span><span className="course-level-label">{c.level}</span><h3>{c.title}</h3><p>{c.description}</p><div><span>{c.lessons} leçons</span><Arrow/></div></Link>)}</div>
  </section>

  <section className="ultra-section teacher-story" id="enseignant">
    <div className="teacher-story-media" role="img" aria-label="Portrait du professeur EL PROF"></div>
    <div className="teacher-story-copy">
      <div className="section-kicker">L’HUMAIN DERRIÈRE EL PROF</div>
      <h2>Apprendre.<br/><em>Transmettre.</em><br/>Réussir ensemble.</h2>
      <p>Une plateforme éducative pensée par un pédagogue, avec une conviction simple : le numérique doit rendre l’apprentissage plus clair, plus humain et plus motivant.</p>
      <div className="teacher-story-points">
        <span><b>01</b> Une pédagogie structurée</span>
        <span><b>02</b> Des contenus conçus pour les élèves</span>
        <span><b>03</b> Une progression visible</span>
      </div>
      <Link href="/cours" className="text-link">Découvrir l’approche EL PROF <Arrow/></Link>
    </div>
  </section>

  <section className="ultra-section final-section">
    <div className="final-card"><div><div className="section-kicker">PRÊT À COMMENCER ?</div><h2>Ton parcours commence ici.</h2><p>Crée ton compte gratuitement et découvre l’expérience EL PROF.</p></div><Link href="/connexion?signup=1" className="ultra-btn ultra-btn-yellow">Créer mon compte <Arrow/></Link></div>
  </section>
 </main>
}
