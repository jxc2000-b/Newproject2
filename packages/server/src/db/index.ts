import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️  DATABASE_URL not set, using default development connection string');
  console.warn('⚠️  DO NOT use default credentials in production!');
}

const finalConnectionString = connectionString || 'postgresql://postgres:postgres@localhost:5432/feedplatform';

// For migrations
export const migrationClient = postgres(finalConnectionString, { max: 1 });

// For queries
const queryClient = postgres(finalConnectionString);
export const db = drizzle(queryClient);
