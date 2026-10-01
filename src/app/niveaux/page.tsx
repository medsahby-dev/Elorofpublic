import Image from "next/image";
import Link from "next/link";

const levels=[
 {name:"7ème",group:"Collège",desc:"Fondations solides en français.",asset:"level-7.svg"},
 {name:"8ème",group:"Collège",desc:"Consolider les bases et progresser.",asset:"level-8.svg"},
 {name:"9ème",group:"Collège",desc:"Préparer sereinement le passage au lycée.",asset:"level-9.svg"},
 {name:"Seconde",group:"Lycée",desc:"Structurer les compétences et les méthodes.",asset:"level-2.svg"},
 {name:"Première",group:"Lycée",desc:"Approfondir l'analyse et l'expression.",asset:"level-2.svg"},
 {name:"Terminale",group:"Lycée",desc:"Renforcer les acquis avant les examens.",asset:"level-3.svg"},
 {name:"Bac Tunisien",group:"Examen",desc:"Parcours complet de préparation au Bac.",asset:"level-bac.svg"},
 {name:"Adultes",group:"Formation continue",desc:"Améliorer son français à son rythme.",asset:"level-3.svg"}
];

export default function LevelsPage(){
 return <main className="page levels-v2">
  <div className="page-hero levels-hero"><div><span className="eyebrow">PARCOURS EL PROF</span><h1>Choisis ton <span>niveau.</span></h1><p>Chaque parcours est organisé autour de tes objectifs, de tes cours et de ta progression.</p></div><Link href="/cours" className="btn btn-yellow">Voir les cours →</Link></div>
  <div className="levels-group"><span className="eyebrow">COLLÈGE</span><div className="levels-grid">{levels.filter(l=>l.group==="Collège").map(l=><LevelCard key={l.name} l={l}/>)}</div></div>
  <div className="levels-group"><span className="eyebrow">LYCÉE</span><div className="levels-grid">{levels.filter(l=>l.group==="Lycée").map(l=><LevelCard key={l.name} l={l}/>)}</div></div>
  <div className="levels-grid levels-special">{levels.filter(l=>l.group==="Examen"||l.group==="Formation continue").map(l=><LevelCard key={l.name} l={l}/>)}</div>
 </main>
}

function LevelCard({l}:{l:typeof levels[number]}){
 return <Link href={`/cours?level=${encodeURIComponent(l.name)}`} className="level-card-v2"><div className="level-card-art"><Image src={`/reference/${l.asset}`} alt="" width={72} height={72}/></div><div><small>{l.group}</small><h2>{l.name}</h2><p>{l.desc}</p></div><span>→</span></Link>
}
