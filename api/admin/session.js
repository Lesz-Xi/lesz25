import { requireOwnerSession } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const user = await requireOwnerSession(req, res);

  if (!user) {
    return;
  }

  res.status(200).json({
    authorized: true,
    user,
  });
}
