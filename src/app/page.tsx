import Image from "next/image";
import Link from "next/link";

const subjects = [
  {name:"Français", desc:"Cours, exercices, fiches et annales corrigées", tone:"blue", icon:"book"},
  {name:"Méthodologie", desc:"Techniques et stratégies pour réussir", tone:"mint", icon:"doc"},
  {name:"Culture générale", desc:"Synthèses et fiches essentielles", tone:"coral", icon:"bulb"},
  {name:"Préparation Bac", desc:"Programmes, sujets et simulations", tone:"violet", icon:"chart"}
];

const levelCards = [
  {name:"Collège", sub:"7ème · 8ème · 9ème", icon:"level-1.svg", tone:"blue"},
  {name:"Lycée", sub:"Seconde · Première · Terminale", icon:"level-2.svg", tone:"orange"},
  {name:"Bac Tunisien", sub:"Préparation complète", icon:"level-bac.svg", tone:"coral"},
  {name:"Adultes", sub:"Cours et formation continue", icon:"level-3.svg", tone:"mint"}
];

const plans = [
  {name:"Essentiel", price:"29", desc:"Accès aux cours de base", features:["Accès aux vidéos de cours","Fiches PDF","Exercices de base"], icon:"price-essential.svg"},
  {name:"Premium", price:"49", desc:"Accès complet + accompagnement", features:["Tout le contenu Essentiel","Exercices avancés","Suivi de progression","Support prioritaire"], icon:"price-plus.svg", featured:true},
  {name:"Pro", price:"79", desc:"Préparation Bac complète", features:["Tout le contenu Premium","Sujets et annales corrigés","Simulations d’examen","Sessions de suivi personnalisées"], icon:"price-family.svg"}
];

function Arrow(){return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M10 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function Check(){return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 3.2 3.2L16 5.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function SubjectIcon({type}:{type:string}){
  if(type==="doc") return <svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M15 3v5h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.6"/></svg>;
  if(type==="bulb") return <svg viewBox="0 0 24 24"><path d="M8 15.5c-1.2-1-2-2.6-2-4.5a6 6 0 1 1 12 0c0 1.9-.8 3.5-2 4.5-.8.7-1 1.3-1 2.5h-6c0-1.2-.2-1.8-1-2.5Z" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M9 21h6M9 18h6" stroke="currentColor" strokeWidth="1.6"/></svg>;
  if(type==="chart") return <svg viewBox="0 0 24 24"><path d="M5 20V10h4v10M10 20V5h4v15M15 20v-7h4v7" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20h17" stroke="currentColor" strokeWidth="1.8"/></svg>;
  return <svg viewBox="0 0 24 24"><path d="M4 5h16v14H4z" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M8 5v14M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6"/></svg>;
}

export default function Home(){
  return <main className="v2-home">
    <section className="v2-hero">
      <div className="v2-hero-copy">
        <div className="v2-kicker">PLATEFORME ÉDUCATIVE · TUNISIE</div>
        <h1>Apprendre<br/><span>aujourd’hui</span><br/>pour réussir demain</h1>
        <p>Des cours de qualité, des ressources interactives et un accompagnement personnalisé pour tous les niveaux en Tunisie.</p>
        <div className="v2-actions">
          <Link href="/cours" className="v2-btn v2-btn-primary">Commencer maintenant <Arrow/></Link>
          <Link href="#plateforme" className="v2-btn v2-btn-video"><b>▶</b> Voir la vidéo</Link>
        </div>
        <div className="v2-feature-strip">
          <span>◆ <b>Cours complets</b><small>et structurés</small></span>
          <span>▶ <b>Vidéos HD</b><small>et fiches PDF</small></span>
          <span>▮ <b>Suivi de progression</b><small>personnalisé</small></span>
          <span>♣ <b>Communauté</b><small>d’apprenants</small></span>
        </div>
      </div>
      <div className="v2-hero-art">
        <div className="v2-hero-slogan left">Le français,<br/>plus simple,<br/>plus proche<br/>de toi !</div>
        <div className="v2-hero-slogan right">Apprendre<br/>Réussir<br/>Grandir</div>
        <div className="v2-asset-frame v2-student-asset">
          <Image src="/reference/hero-v2.webp" alt="Élève EL PROF" fill priority sizes="(max-width: 1050px) 75vw, 600px"/>
        </div>
        <div className="v2-art-blob blob-blue"/>
        <div className="v2-art-blob blob-yellow"/>
        <div className="v2-hero-doodle crown">♛</div>
        <div className="v2-hero-doodle heart">♡</div>
      </div>
    </section>

    <section className="v2-section v2-subjects">
      <div className="v2-section-head"><div><h2>Nos <span>matières</span></h2></div><Link href="/cours" className="v2-link">Voir tous les cours <Arrow/></Link></div>
      <div className="v2-subject-grid">
        {subjects.map(s=><Link href="/cours" className={"v2-subject "+s.tone} key={s.name}><i><SubjectIcon type={s.icon}/></i><div><h3>{s.name}</h3><p>{s.desc}</p></div><b><Arrow/></b></Link>)}
      </div>
    </section>

    <section className="v2-stats">
      <div><i>◆</i><strong>5000+</strong><span>Apprenants actifs</span></div>
      <div><i>▶</i><strong>300+</strong><span>Vidéos de cours</span></div>
      <div><i>▤</i><strong>1000+</strong><span>Fiches et exercices</span></div>
      <div><i>♣</i><strong>98%</strong><span>Taux de satisfaction</span></div>
    </section>

    <section className="v2-section v2-levels" id="niveaux">
      <div className="v2-section-head"><div><h2>Pour tous les <span>niveaux</span></h2><p>Un accompagnement adapté à chaque étape de votre parcours.</p></div></div>
      <div className="v2-level-grid compact">
        {levelCards.map((l,i)=><Link href={"/cours?level="+encodeURIComponent(i===0?"7ème":i===1?"1ère":i===2?"Bac":"Adultes")} key={l.name}><div className={"v2-level-icon "+l.tone}><Image src={"/reference/"+l.icon} alt="" width={38} height={38}/></div><div><strong>{l.name}</strong><span>{l.sub}</span></div><Arrow/></Link>)}
      </div>
    </section>

    <section className="v2-platform v2-section" id="plateforme">
      <div className="v2-device-stage">
        <div className="v2-device laptop"><div className="device-top">EL PROF <span>Mes cours</span></div><div className="device-sidebar"/><div className="device-screen"><b>EL PROF</b><span>Cours en cours</span><i/></div></div>
        <div className="v2-device tablet"><div className="phone-head">Mes cours</div><div className="phone-line"/><div className="phone-line"/><div className="phone-line"/></div>
        <div className="v2-device phone"><div className="phone-head">Ma progression</div><div className="progress-ring">75%</div><div className="phone-line"/><div className="phone-line"/></div>
      </div>
      <div className="v2-platform-copy">
        <span>UNE PLATEFORME COMPLÈTE ET INTUITIVE</span>
        <h2>Une plateforme <em>complète</em><br/>et intuitive</h2>
        <p>Accédez à vos cours depuis n'importe quel appareil, suivez votre progression et bénéficiez d'un accompagnement personnalisé.</p>
        <div className="v2-check-grid">{["Vidéos de haute qualité","Suivi de progression","Fiches PDF téléchargeables","Accès 24/7","Exercices interactifs","Support et accompagnement"].map(x=><span key={x}><Check/>{x}</span>)}</div>
      </div>
    </section>

    <section className="v2-section v2-pricing" id="offres">
      <div className="v2-section-head"><div><h2>Nos <span>offres</span></h2><p>Des formules flexibles pour répondre à vos besoins</p></div><div className="v2-toggle"><b>Mensuel</b><span>Annuel</span><em>-20%</em></div></div>
      <div className="v2-price-grid">{plans.map((p,i)=><article className={"v2-price "+(p.featured?"featured":"")} key={p.name}>{p.featured&&<div className="v2-popular">Le plus populaire</div>}<div className="v2-plan-icon"><Image src={"/reference/"+p.icon} alt="" width={38} height={38}/></div><h3>{p.name}</h3><p>{p.desc}</p><div className="v2-price-value"><strong>{p.price}</strong><small>DT / mois</small></div><ul>{p.features.map(f=><li key={f}><Check/>{f}</li>)}</ul><Link href="/connexion?signup=1" className={"v2-price-btn "+(p.featured?"fill":"outline")}>Choisir cette offre</Link></article>)}</div>
    </section>

    <section className="v2-teacher" id="a-propos">
      <div className="v2-teacher-copy">
        <span>L’ACCOMPAGNEMENT EL PROF</span>
        <h2>Apprendre avec<br/><em>un professeur</em></h2>
        <p>Une pédagogie claire, structurée et proche de l’apprenant. Cours, méthodes, exercices et accompagnement sont réunis dans une même expérience pour avancer avec confiance.</p>
        <Link href="/cours" className="v2-btn v2-btn-primary">Découvrir les cours <Arrow/></Link>
      </div>
      <div className="v2-teacher-photo">
        <Image src="/reference/professor.webp" alt="Professeur EL PROF" fill sizes="(max-width: 1050px) 80vw, 420px"/>
      </div>
    </section>

    <section className="v2-section v2-testimonials">
      <div className="v2-section-head"><div><h2>Ils nous font <span>confiance</span></h2></div></div>
      <div className="v2-testimonial-grid">
        {[
          ["Marwa S.","Élève - 9ème","Des cours clairs et bien expliqués. Grâce à EL PROF, j’ai beaucoup progressé en français !","M"],
          ["Yassine K.","Élève - Terminale","Une plateforme complète et très utile pour la préparation du Bac. Je recommande à 100% !","Y"],
          ["Sarra M.","Élève - Première","Un professeur passionné et toujours disponible. Les fiches sont excellentes !","S"]
        ].map(([name,level,quote,initial])=><article key={name}><div className="v2-avatar">{initial}</div><div className="v2-quote"><p>“{quote}”</p><strong>{name}</strong><small>{level}</small></div><div className="v2-stars">★★★★★</div></article>)}
      </div>
    </section>

    <section className="v2-final">
      <div><h2>Prêt à commencer votre parcours<br/>avec EL PROF ?</h2><p>Rejoignez des milliers d’apprenants et donnez un nouvel élan à votre réussite.</p></div>
      <Link href="/connexion?signup=1" className="v2-btn v2-btn-light">S’inscrire maintenant <Arrow/></Link>
    </section>
  </main>
}