# EL PROF — version production-ready

## Fonctionnalités
- Authentification JWT avec mots de passe hashés
- PostgreSQL et schéma idempotent
- Limitation de débit sur l’API et l’authentification
- Helmet, CORS configurable, validation de base
- Dashboard élève premium responsive
- Cours, leçons, progression et XP
- Exercices, quiz et profil
- Dashboard administrateur et liste des utilisateurs
- Création automatique de l’administrateur via variables d’environnement

## Installation locale
```bash
cp .env.example .env
# Créer la base PostgreSQL correspondant à DATABASE_URL
psql "$DATABASE_URL" -f schema.sql
npm install
npm start
```
Puis ouvrir http://localhost:3000.

## Compte administrateur local
Les variables `ADMIN_EMAIL` et `ADMIN_PASSWORD` créent l’administrateur au premier démarrage. Change impérativement ces valeurs avant une mise en production.

## Déploiement
Configurer les variables d’environnement `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `ADMIN_EMAIL` et `ADMIN_PASSWORD`. Utiliser HTTPS, une base PostgreSQL managée, des sauvegardes et un reverse proxy.

Les paiements Stripe, emails transactionnels, stockage de fichiers et contenu pédagogique réel ne sont pas activés par défaut : ils nécessitent des clés et une politique métier avant production commerciale.
