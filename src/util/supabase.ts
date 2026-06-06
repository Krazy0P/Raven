import { createClient } from "@supabase/supabase-js";
import chalk from "chalk";
import type { Database } from "../types/database.types";
import logger from "@/util/logger";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  logger.error(
    `${chalk.bold("SUPABASE_URL")} and ${chalk.bold("SUPABASE_PUBLISHABLE_KEY")} are required`,
  );
  process.exit(1);
}

const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabase;
