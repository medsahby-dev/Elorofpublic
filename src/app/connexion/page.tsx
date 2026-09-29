"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConnexionContent() {
  const params = useSearchParams();
  const [signup, setSignup] = useState(params.get("signup") === "1");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => setSignup(params.get("signup") === "1"), [params]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    if (signup && password !== confirm) return setMessage("Les mots de passe ne correspondent pas.");
    setLoading(true);
    try {
      const endpoint = signup ? "/api/auth/register" : "/api/auth/login";
      const body = signup ? { firstName, lastName, email, password } : { email, password };
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Une erreur est survenue.");
      window.location.href = "/dashboard";
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally { setLoading(false); }
  }

  return <main className="auth-page">
    <div className="auth-brand"><span className="brand-mark">EP</span><h1>EL PROF</h1><p>Le français plus simple,<br/>plus proche de toi !</p><div className="auth-points">✓ Cours structurés<br/>✓ Exercices et quiz<br/>✓ Progression personnalisée<br/>✓ Classes en direct bientôt disponibles</div></div>
    <form className="auth-card" onSubmit={submit}>
      <div className="auth-switch"><button type="button" className={!signup ? "active" : ""} onClick={() => setSignup(false)}>Connexion</button><button type="button" className={signup ? "active" : ""} onClick={() => setSignup(true)}>Créer un compte</button></div>
      <h2>{signup ? "Bienvenue chez EL PROF 👋" : "Content de te revoir 👋"}</h2>
      <p>{signup ? "Crée ton compte gratuitement pour commencer." : "Connecte-toi à ton espace élève."}</p>
      {signup && <div className="form-row"><label>Prénom<input required value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Mohamed"/></label><label>Nom<input required value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Sahby"/></label></div>}
      <label>E-mail<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="exemple@email.com" autoComplete="email"/></label>
      <label>Mot de passe<input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" autoComplete={signup ? "new-password" : "current-password"}/></label>
      {signup && <label>Confirmer le mot de passe<input required minLength={8} type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="••••••••" autoComplete="new-password"/></label>}
      {message && <div className="form-message">{message}</div>}
      <button className="btn btn-yellow full" disabled={loading}>{loading ? "Patiente..." : signup ? "Créer mon compte →" : "Se connecter →"}</button>
      {!signup && <p className="auth-note">Mot de passe oublié ? La récupération sera ajoutée avec le système e-mail de production.</p>}
      {signup && <small>En créant ton compte, tu acceptes les conditions d'utilisation de la plateforme.</small>}
      <Link className="back-home" href="/">← Retour à l'accueil</Link>
    </form>
  </main>;
}


export default function ConnexionPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ConnexionContent />
    </Suspense>
  );
}
