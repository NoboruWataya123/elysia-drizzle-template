import { drizzle } from 'drizzle-orm/postgres-js';
const db = drizzle(Bun.env.DATABASE_URL!);

export default db;
