import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "#/db/schema"

const databaseUrl = process.env.DATABASE_URL ?? "postgres://catalog:catalog@localhost:5432/catalog"

export const pool = new Pool({
  connectionString: databaseUrl,
})

export const db = drizzle(pool, { schema })
