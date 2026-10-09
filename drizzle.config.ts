import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Reads DATABASE_URL from your environment or .env — falls back to local dev DB.
// To push to production: DATABASE_URL="<neon-url>" npx drizzle-kit push
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
});
