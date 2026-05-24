"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase URL or SERVICE_ROLE key is missing");
}
const supabaseClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceRoleKey);
exports.default = supabaseClient;
