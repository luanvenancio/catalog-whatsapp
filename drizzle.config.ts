import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	dbCredentials: {
		url:
			process.env.DATABASE_URL ??
			"postgres://catalog:catalog@localhost:5432/catalog",
	},
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	strict: true,
	verbose: true,
});
