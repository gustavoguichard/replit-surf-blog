import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.resolve(rootDir, '.env') });

neonConfig.webSocketConstructor = ws;

// Check for the DATABASE_URL and provide a helpful error message
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set.");
  console.log("Please create a .env file in the root directory with the following content:");
  console.log("DATABASE_URL=postgresql://username:password@host:port/database");
  console.log("Or for Neon database: DATABASE_URL=postgres://username:password@endpoint/database");
  
  throw new Error(
    "DATABASE_URL must be set. Please add it to your .env file or environment variables.",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
