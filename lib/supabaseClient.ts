import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://cgnjmropqwjglkrntwaw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnbmptcm9wcXdqZ2xrcm50d2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTY1MjEsImV4cCI6MjA3ODM3MjUyMX0.vdslIQsU5rwI83xVis762WhT4liZKBHfRgVK7Mv5_tY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);