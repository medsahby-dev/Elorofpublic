import { Pool } from "pg";

const globalForDb = globalThis as unknown as { elprofPool?: Pool };

export const db = globalForDb.elprofPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: process.env.NODE_ENV === "production" && process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

if (process.env.NODE_ENV !== "production") globalForDb.elprofPool = db;
