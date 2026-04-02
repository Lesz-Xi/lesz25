import { createClient } from "@supabase/supabase-js";
import { getRequiredEnv } from "./env.js";

let supabase = null;

const getServerSupabase = () => {
  if (!supabase) {
    supabase = createClient(
      getRequiredEnv("VITE_SUPABASE_URL"),
      getRequiredEnv("VITE_SUPABASE_ANON_KEY"),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  return supabase;
};

const parseBearerToken = (authorizationHeader = "") => {
  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length).trim();
};

export const requireOwnerSession = async (req, res) => {
  try {
    const token = parseBearerToken(req.headers.authorization);

    if (!token) {
      res.status(401).json({ error: "Missing bearer token." });
      return null;
    }

    const client = getServerSupabase();
    const { data, error } = await client.auth.getUser(token);

    if (error || !data?.user) {
      res.status(401).json({ error: "Invalid or expired Supabase session." });
      return null;
    }

    const allowedEmail = getRequiredEnv("ADMIN_ALLOWED_EMAIL").toLowerCase();
    const email = data.user.email?.toLowerCase();

    if (!email || email !== allowedEmail) {
      res.status(403).json({ error: "This account is not allowed to access the analytics admin." });
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email,
      name:
        data.user.user_metadata?.full_name ||
        data.user.user_metadata?.name ||
        data.user.email,
    };
  } catch (error) {
    res.status(500).json({ error: error.message || "Unable to verify the admin session." });
    return null;
  }
};
