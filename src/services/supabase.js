import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://mfphbyaqwnxewnmewfgb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcGhieWFxd254ZXdubWV3ZmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDY0MjcsImV4cCI6MjA4MjUyMjQyN30.VsurPcBfBi9I8VWGh8lqBney2IpZNHBZxo3_xTEbqpA";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
