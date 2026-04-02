import { createClient } from "@supabase/supabase-js";

let client = null;

export const getSupabaseConfig = () => ({
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  redirectUrl: import.meta.env.VITE_SUPABASE_REDIRECT_URL,
  allowedEmail: import.meta.env.VITE_ADMIN_ALLOWED_EMAIL,
});

export const getSupabaseClient = () => {
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    return null;
  }

  if (!client) {
    client = createClient(url, anonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    });
  }

  return client;
};
