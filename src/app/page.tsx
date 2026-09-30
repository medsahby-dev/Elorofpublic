import Image from "next/image";
import Link from "next/link";
import { courses, levels } from "@/lib/data";

const levelMeta: Record<string,string> = {
  "7ème":"Consolider les bases","8ème":"Gagner en autonomie","9ème":"Se préparer au lycée",
  "1ère":"Construire ses compétences","2ème":"Approfondir et réussir","3ème":"Vers l’excellence","Bac":"Objectif réussite"
};

const subjects = [
  {name:"Grammaire",desc:"Des explications claires et des exercices ciblés",tone:"blue",icon:"book"},
  {name:"Conjugaison",desc:"Maîtrisez tous les temps en toute simplicité",tone:"coral",icon:"pen"},
  {name:"Compréhension",desc:"Analysez et comprenez tous types de textes",tone:"mint",icon:"doc"},
  {name:"Expression écrite",desc:"Entraînez-vous à bien rédiger et argumenter",tone:"violet",icon:"chat"}
];

const plans = [
  {name:"Essentiel",price:"19",suffix:"DT / mois",desc:"Pour bien commencer",features:["Accès à tous les cours","Exercices interactifs","Suivi de progression"]},
  {name:"Premium",price:"29",suffix:"DT / mois",desc:"La formule complète",features:["Cours + exercices + examens","Suivi personnalisé","Accès sur tous vos appareils","Support prioritaire"],featured:true},
  {name:"Annuel",price:"299",suffix:"DT / an",desc:"Le meilleur rapport qualité/prix",features:["Tout la formule Premium","Accès illimité 12 mois","Économisez jusqu'à 37%"]}
];

function Arrow(){return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M10 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function Check(){return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 3.2 3.2L16 5.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function SubjectIcon({type}:{type:string}) {
  if(type==="pen") return <svg viewBox="0 0 24 24"><path d="m5 19 2.2-5.4L16.8 4l3.2 3.2-9.6 9.6L5 19Z" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="m14.8 6 3.2 3.2" stroke="currentColor" strokeWidth="1.8"/></svg>;
  if(type==="doc") return <svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M15 3v5h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.6"/></svg>;
  if(type==="chat") return <svg viewBox="0 0 24 24"><path d="M5 5h14v10H9l-4 4V5Z" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M9 9h6M9 12h4" stroke="currentColor" strokeWidth="1.6"/></svg>;
  return <svg viewBox="0 0 24 24"><path d="M5 5h14v13H5z" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M8 5v13M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.6"/></svg>;
}

export default function Home(){
 return <main className="v2-home">
  <section className="v2-hero">
    <div className="v2-hero-copy">
      <div className="v2-kicker">PLATEFORME ÉDUCATIVE · TUNISIE</div>
      <h1>Apprenez aujourd’hui<br/>et <span>construisez demain</span></h1>
      <p>Des cours clairs, des exercices interactifs et un accompagnement pour réussir en toute confiance.</p>
      <div className="v2-actions">
        <Link href="/cours" className="v2-btn v2-btn-primary">Découvrir les cours <Arrow/></Link>
        <Link href="#offres" className="v2-btn v2-btn-outline">Voir nos offres</Link>
      </div>
      <div className="v2-trust">
        <div><strong>10 000+</strong><span>Apprenants</span></div>
        <div><strong>500+</strong><span>Cours et ressources</span></div>
        <div><strong>95%</strong><span>Taux de satisfaction</span></div>
      </div>
    </div>
    <div className="v2-hero-art">
      <div className="v2-asset-frame v2-student-asset">
        <Image src="/reference/hero-v2.webp" alt="Élève EL PROF" fill priority sizes="(max-width: 1050px) 68vw, 380px" />
      </div>
      <div className="v2-art-blob blob-blue"/>
      <div className="v2-art-blob blob-yellow"/>
      <div className="v2-floating-chip chip-a"><b>↗</b> Cours interactifs</div>
      <div className="v2-floating-chip chip-b"><b>▥</b> Suivi de progression</div>
      <div className="v2-floating-chip chip-c"><b>✦</b> Méthodes efficaces</div>
      <div className="v2-handwrite">Réussir<br/>avec<br/><b>EL PROF</b></div>
    </div>
  </section>

  <section className="v2-section v2-why">
    <div className="v2-section-head"><div><span>POURQUOI CHOISIR EL PROF ?</span><h2>Une expérience pensée pour réussir.</h2></div></div>
    <div className="v2-benefits">
      {[
        ["♢","Cours de qualité","Rédigés par des experts et conformes au programme."],
        ["↗","Exercices interactifs","Entraînez-vous et progressez efficacement."],
        ["◇","Suivi personnalisé","Suivez vos progrès et identifiez vos points forts."],
        ["▣","Accessible partout","Sur ordinateur, tablette et mobile."]
      ].map(([icon,title,desc])=><article key={title}><i>{icon}</i><h3>{title}</h3><p>{desc}</p></article>)}
    </div>
  </section>

  <section className="v2-section v2-courses" id="cours-principaux">
    <div className="v2-section-head"><div><span>NOS COURS PRINCIPAUX</span><h2>Apprendre devient plus simple.</h2></div><Link href="/cours" className="v2-link">Voir tous les cours <Arrow/></Link></div>
    <div className="v2-subject-grid">
      {subjects.map(s=><Link href="/cours" className={"v2-subject "+s.tone} key={s.name}><i><SubjectIcon type={s.icon}/></i><h3>{s.name}</h3><p>{s.desc}</p><b><Arrow/></b></Link>)}
    </div>
  </section>

  <section className="v2-section v2-platform">
    <div className="v2-platform-copy"><span>UNE PLATEFORME PENSÉE POUR VOTRE RÉUSSITE</span><h2>Votre parcours.<br/><em>Sur tous vos appareils.</em></h2><p>Retrouvez vos cours, vos exercices, vos quiz et votre progression au même endroit.</p><Link href="/connexion?signup=1" className="v2-btn v2-btn-primary">Commencer maintenant <Arrow/></Link></div>
    <div className="v2-device-stage">
      <div className="v2-device laptop"><div className="device-top">EL PROF <span>Mes cours</span></div><div className="device-lines"><i/><i/><i/><i/></div></div>
      <div className="v2-device phone"><div className="phone-head">Mes cours</div><div className="phone-line"/><div className="phone-line"/><div className="phone-line"/></div>
      <div className="v2-device-note">Apprenez<br/>à votre rythme<br/>sur tous vos appareils ↗</div>
    </div>
  </section>

  <section className="v2-section v2-levels" id="niveaux">
    <div className="v2-section-head"><div><span>UN PARCOURS POUR CHAQUE ÉLÈVE</span><h2>Du 7ème au Bac.</h2></div><p>Choisissez votre niveau et commencez là où vous êtes.</p></div>
    <div className="v2-level-grid">{levels.map((level,i)=><Link href={"/cours?level="+encodeURIComponent(level)} key={level}><div className="v2-level-icon"><Image src={"/reference/"+(level==="Bac"?"level-bac":"level-"+(i+1))+".svg"} alt="" width={38} height={38}/></div><small>0{i+1}</small><strong>{level}</strong><span>{levelMeta[level]}</span><Arrow/></Link>)}</div>
  </section>

  <section className="v2-section v2-pricing" id="offres">
    <div className="v2-section-head"><div><span>NOS FORMULES</span><h2>Choisissez la formule qui vous convient.</h2></div></div>
    <div className="v2-price-grid">{plans.map((p,i)=><article className={"v2-price "+(p.featured?"featured":"")} key={p.name}>{p.featured&&<div className="v2-popular">Le plus populaire</div><div className="v2-plan-icon"><Image src={"/reference/"+(i===0?"price-essential":i===1?"price-plus":"price-family")+".svg"} alt="" width={42} height={42}/></div>}<h3>{p.name}</h3><p>{p.desc}</p><div className="v2-price-value"><strong>{p.price}</strong><small>{p.suffix}</small></div><ul>{p.features.map(f=><li key={f}><Check/>{f}</li>)}</ul><Link href="/connexion?signup=1" className={"v2-price-btn "+(p.featured?"fill":"outline")}>Choisir cette formule <Arrow/></Link></article>)}</div>
  </section>

  <section className="v2-section v2-teacher">
    <div className="v2-teacher-copy"><span>VOTRE RÉUSSITE EST NOTRE MISSION</span><h2>Apprendre.<br/><em>Transmettre.</em><br/>Réussir ensemble.</h2><p>EL PROF vous accompagne avec des contenus de qualité, des outils interactifs et une méthode pensée pour progresser sereinement.</p><Link href="/cours" className="v2-btn v2-btn-white">Découvrir EL PROF <Arrow/></Link></div>
    <div className="v2-teacher-photo"><Image src="/reference/professor.webp" alt="Professeur EL PROF" fill sizes="(max-width: 900px) 100vw, 48vw" /></div>
  </section>

  <section className="v2-section v2-testimonials">
    <div className="v2-section-head"><div><span>ILS PARLENT DE NOUS</span><h2>Une expérience qui compte.</h2></div></div>
    <div className="v2-testimonial-grid">{["Des cours très clairs et une plateforme simple à utiliser. J’ai vraiment progressé !","EL PROF m’a aidé à mieux comprendre et à prendre confiance en moi.","Une équipe à l’écoute et des ressources de grande qualité. Merci !"].map((quote,i)=><article key={i}><div>★★★★★</div><p>“{quote}”</p><strong>{["Élève de 9ème","Élève de Bac","Étudiante"][i]}</strong></article>)}</div>
  </section>

  <section className="v2-final"><div><span>PRÊT À COMMENCER ?</span><h2>Construisez votre réussite avec EL PROF.</h2></div><Link href="/connexion?signup=1" className="v2-btn v2-btn-primary">Créer mon compte <Arrow/></Link></div>
 </main>
}
