import "./globals.css";
import "./premium.css";
import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";
import BrandLogo from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "EL PROF — Le français plus simple, plus proche de toi",
  description: "EL PROF, plateforme éducative tunisienne pour apprendre, pratiquer et progresser en français.",
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">Aller au contenu</a>
        <header className="site-header">
          <BrandLogo />
          <nav aria-label="Navigation principale">
            <Link href="/cours">Cours</Link>
            <Link href="/#offres">Offres</Link>
            <Link href="/classes">Classes en direct</Link>
            <Link href="/#niveaux">Niveaux</Link>
            <Link href="/#apropos">Méthode</Link>
          </nav>
          <div className="header-actions">
            <Link href="/connexion" className="login-link">Connexion</Link>
            <Link href="/connexion?signup=1" className="btn btn-yellow">Commencer</Link>
            <ThemeToggle />
          </div>
        </header>
        <div id="main-content">{children}</div>
        <MobileNav />
        <footer className="footer" id="contact">
          <div>
            <BrandLogo />
            <p>Le français plus simple, plus proche de toi.</p>
          </div>
          <div><strong>Explorer</strong><Link href="/cours">Cours</Link><Link href="/classes">Classes en direct</Link><Link href="/#offres">Offres</Link><Link href="/connexion">Connexion</Link></div>
          <div><strong>Apprendre</strong><span>Grammaire</span><span>Conjugaison</span><span>Expression écrite</span><span>Préparation Bac</span></div>
          <div><strong>Famille</strong><span>Suivi parental</span><span>Progression</span><span>Résultats</span><span>Rapports</span></div>
          <div className="footer-bottom">© 2026 EL PROF — Tous droits réservés.</div>
        </footer>
      </body>
    </html>
  );
}
