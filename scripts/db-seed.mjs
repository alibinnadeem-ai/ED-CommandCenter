import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not configured. Add your Neon connection string to .env first.");
  process.exit(1);
}

const sql = neon(databaseUrl);
const seedsDir = join(process.cwd(), "db", "seeds");
const files = (await readdir(seedsDir))
  .filter((file) => file.endsWith(".sql"))
  .sort();

for (const file of files) {
  const filePath = join(seedsDir, file);
  const body = await readFile(filePath, "utf8");
  const statements = body
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.query(`${statement};`, []);
  }

  console.log(`Applied ${file}`);
}
