import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";

let supabase: any | undefined;

if (!supabase) {
  supabase = createClient<Database>(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_ANON_KEY || "",
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

export default supabase;
