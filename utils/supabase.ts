import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.SUPABASE_URL
// const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(
  'https://ryodeyolmvsorplzjtwa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5b2RleW9sbXZzb3JwbHpqdHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MzkyODksImV4cCI6MjA0NzAxNTI4OX0.GnifOA2Rm7FhxN_L3Zo5JoSzXger8XSBGa7cHJguimQ')
