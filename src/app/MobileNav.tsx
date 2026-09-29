"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function MobileNav(){
 const path=usePathname();
 const items=[
  ["/","⌂","Accueil"],["/cours","▦","Cours"],["/dashboard","◔","Progression"],["/classes","◉","Classes"],["/connexion","◯","Profil"]
 ];
 return <nav className="mobile-nav" aria-label="Navigation mobile">{items.map(([href,icon,label])=><Link key={href} href={href} className={path===href?"active":""}><span>{icon}</span><small>{label}</small></Link>)}</nav>;
}
