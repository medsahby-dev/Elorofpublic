import Link from "next/link";
import { courses, levels } from "@/lib/data";

const icons: Record<string, string> = {
  "7ème": "📚", "8ème": "🎯", "9ème": "📝", "1ère": "📖", "2ème": "🧠", "3ème": "🎓", "Bac": "🏆"
};

export default function Home() {
  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">🇹🇳 PLATEFORME ÉDUCATIVE TUNISIENNE</div>
            <h1>Le français <span>plus simple,</span><br/>plus proche de toi !</h1>
            <p>Cours, exercices, quiz et préparation aux examens pour tous les niveaux du système éducatif tunisien.</p>
            <div className="hero-buttons">
              <Link href="/connexion?signup=1" className="btn btn-yellow btn-large">Commencer gratuitement →</Link>
              <Link href="/cours" className="btn btn-outline btn-large">Découvrir les cours</Link>
            </div>
            <div className="hero-trust"><span>✓ Cours structurés</span><span>✓ Suivi personnalisé</span><span>✓ Accessible 24/7</span></div>
          </div>
          <div className="hero-art">
            <div className="character">
              <div className="cap">EL<br/>PROF</div>
              <div className="face">🤓</div>
              <div className="hood">👨‍🏫</div>
            </div>
            <div className="speech">Le français,<br/><b>c'est la clé !</b> 🇫🇷</div>
            <div className="floating-card card-a">📚<b>+30</b><small>cours</small></div>
            <div className="floating-card card-b">🎯<b>+100</b><small>exercices</small></div>
          </div>
        </section>

        <section className="section" id="niveaux">
          <div className="section-title"><span>CHOISIS TON NIVEAU</span><h2>Du 7ème au Bac, on t'accompagne à chaque étape !</h2></div>
          <div className="level-grid">
            {levels.map(level => <Link href={`/cours?level=${encodeURIComponent(level)}`} className="level-card" key={level}><span>{icons[level]}</span><b>{level}</b></Link>)}
          </div>
        </section>

        <section className="section split-section">
          <div className="test-card">
            <span className="big-icon">🎯</span><div><span className="mini-label">TEST GRATUIT</span><h2>Teste ton niveau</h2><p>Découvre où tu en es et construis ton parcours.</p><Link href="/quiz" className="btn btn-dark">Commencer le test →</Link></div>
          </div>
          <div className="plus-card">
            <div><span className="mini-label">EL PROF+</span><h2>Plus de contenu,<br/>plus de progrès !</h2><ul><li>✓ Cours complets</li><li>✓ Exercices illimités</li><li>✓ Suivi de progression</li><li>✓ Module Bac</li></ul></div>
            <div className="price"><b>25 DT</b><small>/ mois</small></div>
          </div>
        </section>

        <section className="section live-section"><div className="live-banner"><div><span className="mini-label">NOUVEAU — BIENTÔT</span><h2>🎥 Des cours en direct directement dans EL PROF</h2><p>Une vraie classe virtuelle pour apprendre avec le professeur, poser tes questions et progresser ensemble.</p></div><Link href="/classes" className="btn btn-dark">Découvrir les classes →</Link></div></section>

        <section className="section" id="apropos">
          <div className="section-title"><span>POURQUOI CHOISIR EL PROF ?</span><h2>Une méthode pensée pour apprendre vraiment.</h2></div>
          <div className="benefits"><div>👨‍🏫<b>Des profs passionnés</b><p>Une pédagogie claire et progressive.</p></div><div>🎯<b>Une méthode efficace</b><p>Des activités centrées sur les objectifs.</p></div><div>💛<b>Des prix attractifs</b><p>Une plateforme accessible aux élèves.</p></div><div>👥<b>Une communauté</b><p>Apprendre ensemble et progresser.</p></div></div>
        </section>

        <section className="cta"><div><span>PRÊT À BOOSTER TON FRANÇAIS ?</span><h2>Construis ton parcours de français, à ton rythme.</h2></div><Link href="/connexion?signup=1" className="btn btn-yellow btn-large">Commencer maintenant →</Link></section>
      </main>
    </>
  );
}
