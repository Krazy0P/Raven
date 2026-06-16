import { $ } from "bun";

const projectId = process.env.SUPABASE_PROJECT_ID;

if (!projectId) {
  console.error("Error: SUPABASE_PROJECT_ID not found in .env");
  process.exit(1);
}

await $`bunx supabase gen types typescript --project-id ${projectId} > ./src/types/database.types.ts`;
