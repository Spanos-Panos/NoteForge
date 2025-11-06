import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bdoyaxgdgdukpxlacgrn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkb3lheGdkZ2R1a3B4bGFjZ3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTk2MTksImV4cCI6MjA3NzMzNTYxOX0.QfH9hYR6yNf0z0h4wrcGC739qclLUATWoFVw9UWWiac";

export const supabase = createClient(supabaseUrl , supabaseAnonKey);