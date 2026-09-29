# EL PROF V3.5 — Teacher Studio

Teacher Studio and Course Builder built on EL PROF V3.4.

## Features
- teacher dashboard `/teacher`
- create course `/teacher/courses/new`
- course builder `/teacher/courses/[id]`
- create modules and lessons
- publish/unpublish modules and lessons
- course lifecycle: draft, in_review, published, archived
- server-side teacher/admin authorization

## Migration
```bash
npm install
npm run db:migrate
npm run build
```

Migration: `migrations/004_teacher_studio.sql`

A course can only be published when it contains at least one published module and one published lesson.

## V3.9 Production Hardening
- `GET /api/health` for application + PostgreSQL health checks.
- `manifest.webmanifest`, `robots.txt`, and dynamic `sitemap.xml`.
- Security response headers at the Next.js layer.
- Production Nginx reverse-proxy configuration in `ops/nginx/elprof.conf`.
- PostgreSQL custom-format backup helper: `npm run db:backup`.
- Deployment/backup notes in `ops/README.md`.
