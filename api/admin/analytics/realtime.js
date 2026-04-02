import { requireOwnerSession } from "../../_lib/auth.js";
import { fetchActiveVisitors, fetchWebsiteStats, getRealtimeWindow } from "../../_lib/umami.js";

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
    const windowRange = getRealtimeWindow();
    const [activeVisitors, stats] = await Promise.all([
      fetchActiveVisitors(),
      fetchWebsiteStats(windowRange),
    ]);

    res.status(200).json({
      realtime: {
        activeVisitors: Number(activeVisitors?.x ?? activeVisitors?.activeVisitors ?? activeVisitors?.value ?? 0),
        last30MinutesVisitors: Number(stats.visitors ?? 0),
        last30MinutesPageviews: Number(stats.pageviews ?? 0),
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Unable to fetch realtime analytics." });
  }
}
