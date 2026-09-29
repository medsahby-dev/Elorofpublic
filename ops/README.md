# EL PROF production operations

## Health
`GET /api/health` checks application availability and PostgreSQL connectivity.

## Nginx
Copy `nginx/elprof.conf` to `/etc/nginx/sites-available/`, create the enabled symlink, run `nginx -t`, then reload Nginx. Configure Let's Encrypt first so the certificate paths exist.

## PostgreSQL backups
Run `DATABASE_URL=... ./scripts/backup-db.sh`. Store backups outside the application container and test restoration regularly.

## Deployment order
1. Backup PostgreSQL.
2. Pull/build the new release.
3. Run `npm run db:migrate` against the production database.
4. Run `npm run build`.
5. Restart the web container/process.
6. Check `/api/health`.
7. Verify the public homepage, login and a course page.
