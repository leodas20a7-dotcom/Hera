import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mcrghkxtbblqvwdhnpfx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jcmdoa3h0YmJscXZ3ZGhucGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMTgyNTUsImV4cCI6MjEwMjc5NDI1NX0.XrIyEOTEnf0r0hwSASuPQPPuuzJuZYN-TrWMcYWMYtA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
