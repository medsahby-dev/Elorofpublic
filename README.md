# EL PROF — version production-ready

## Authentification
L’inscription et la connexion e-mail utilisent `POST /api/auth/register` et `POST /api/auth/login`. Le navigateur stocke le JWT dans `localStorage` sous `elprof_token` puis redirige vers le tableau de bord.

### Déploiement Hostinger VPS
1. Créer une base PostgreSQL et renseigner `DATABASE_URL`.
2. Exécuter `psql "$DATABASE_URL" -f schema.sql`.
3. Définir un `JWT_SECRET` aléatoire d’au moins 32 caractères.
4. Définir `NODE_ENV=production`, `CORS_ORIGIN` avec l’URL HTTPS du site, puis lancer `npm install` et `npm start`.
5. Utiliser un reverse proxy HTTPS (Nginx) devant Node.js et conserver les secrets uniquement dans l’environnement Hostinger.

Les boutons Google et Apple restent volontairement bloqués tant que les identifiants OAuth, les URLs de callback HTTPS et les routes OAuth serveur correspondantes ne sont pas configurés. Il ne faut jamais simuler une connexion sociale côté navigateur.

## Installation locale
```bash
cp .env.example .env
psql "$DATABASE_URL" -f schema.sql
npm install
npm start
```

Puis ouvrir http://localhost:3000.
