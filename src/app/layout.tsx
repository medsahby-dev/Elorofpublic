import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";

export const metadata: Metadata = {
  title: "EL PROF — Le français plus simple, plus proche de toi !",
  description: "Plateforme tunisienne de cours de français pour tous les niveaux."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body><a className="skip-link" href="#main-content">Aller au contenu</a>
        <header className="site-header">
          <Link href="/" className="brand">
            <span className="brand-mark">EP</span>
            <span>EL <b>PROF</b></span>
          </Link>
          <nav>
            <Link href="/cours">Cours</Link>
            <Link href="/classes">🎥 Classes en direct</Link>
            <Link href="/#niveaux">Niveaux</Link>
            <Link href="/#apropos">Pourquoi EL PROF ?</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
          <div className="header-actions">
            <Link href="/connexion" className="login-link">Connexion</Link>
            <Link href="/connexion?signup=1" className="btn btn-yellow">S'inscrire</Link><ThemeToggle />
          </div>
        </header>
        <div id="main-content">{children}</div><MobileNav />
        <footer className="footer" id="contact">
          <div>
            <div className="brand footer-brand"><span className="brand-mark">EP</span><span>EL <b>PROF</b></span></div>
            <p>Le français plus simple, plus proche de toi !</p>
          </div>
          <div><strong>Liens utiles</strong><Link href="/cours">Cours</Link>
            <Link href="/classes">🎥 Classes en direct</Link><Link href="/connexion">Connexion</Link><Link href="/dashboard">Espace élève</Link></div>
          <div><strong>Plateforme</strong><Link href="/classes">Classes en direct</Link><span>Grammaire</span><span>Conjugaison</span><span>Expression écrite</span></div>
          <div><strong>EL PROF+</strong><span>Cours complets</span><span>Exercices</span><span>Préparation examens</span></div>
          <div className="footer-bottom">© 2026 EL PROF — Tous droits réservés.</div>
        </footer>
      </body>
    </html>
  );
}
