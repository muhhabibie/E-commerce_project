require("dotenv").config();
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Supabase URL or SERVICE_ROLE key is missing");
}

const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

export default supabaseClient;
