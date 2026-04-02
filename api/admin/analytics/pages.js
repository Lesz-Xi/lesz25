import { requireOwnerSession } from "../../_lib/auth.js";
import { fetchMetric, getOverviewWindow, normalizeMetricRows } from "../../_lib/umami.js";

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

  try {
    const windowRange = getOverviewWindow();
    const pages = await fetchMetric({ type: "url", ...windowRange, limit: 8 });

    res.status(200).json({
      pages: normalizeMetricRows(pages),
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Unable to fetch page analytics." });
  }
}
