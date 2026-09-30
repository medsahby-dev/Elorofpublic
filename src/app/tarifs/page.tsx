import Link from "next/link";
import Image from "next/image";

const plans=[
 {name:"Essentiel",price:"29",desc:"Pour construire des bases solides.",icon:"price-essential.svg",features:["Accès aux cours de base","Vidéos et fiches PDF","Exercices essentiels"]},
 {name:"Premium",price:"49",desc:"Pour apprendre avec un accompagnement complet.",icon:"price-plus.svg",featured:true,features:["Tout le contenu Essentiel","Exercices avancés","Suivi de progression","Support prioritaire"]},
 {name:"Pro",price:"79",desc:"Pour une préparation intensive et structurée.",icon:"price-family.svg",features:["Tout le contenu Premium","Sujets et annales corrigés","Simulations d’examen","Sessions de suivi"]}
];

export default function PricingPage(){
 return <main className="page pricing-v2"><div className="page-hero pricing-hero"><div><span className="eyebrow">OFFRES EL PROF</span><h1>Une formule pour <span>chaque parcours.</span></h1><p>Choisis ton niveau d'accompagnement et commence directement ton apprentissage.</p></div><span className="pricing-note">Mensuel · Sans engagement</span></div>
 <div className="pricing-page-grid">{plans.map(p=><article className={"pricing-page-card "+(p.featured?"featured":"")} key={p.name}>{p.featured&&<div className="pricing-popular">LE PLUS POPULAIRE</div>}<div className="pricing-page-icon"><Image src={"/reference/"+p.icon} alt="" width={42} height={42}/></div><h2>{p.name}</h2><p>{p.desc}</p><div className="pricing-page-price"><strong>{p.price}</strong><span>DT / mois</span></div><ul>{p.features.map(f=><li key={f}>✓ {f}</li>)}</ul><Link href="/connexion?signup=1" className={"btn "+(p.featured?"btn-yellow":"btn-light")+" full"}>Commencer avec {p.name} →</Link></article>)}</div>
 <div className="pricing-bottom"><div><span className="eyebrow">BESOIN D'UN PARCOURS</span><h2>Commence simplement. Progresse ensuite.</h2><p>Tu peux commencer par les cours et faire évoluer ton accompagnement selon tes besoins.</p></div><Link href="/cours" className="btn btn-light">Explorer les cours</Link></div>
 </main>
}
