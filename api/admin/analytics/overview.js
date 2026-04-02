import { requireOwnerSession } from "../../_lib/auth.js";
import { fetchMetric, fetchWebsiteStats, getOverviewWindow, normalizeMetricRows } from "../../_lib/umami.js";

const percentage = (value) => {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? Number(numeric.toFixed(1)) : 0;
};

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
    const [stats, referrers, browsers, devices] = await Promise.all([
      fetchWebsiteStats(windowRange),
      fetchMetric({ type: "referrer", ...windowRange }),
      fetchMetric({ type: "browser", ...windowRange }),
      fetchMetric({ type: "device", ...windowRange }),
    ]);

    res.status(200).json({
      overview: {
        visitors: Number(stats.visitors ?? 0),
        pageviews: Number(stats.pageviews ?? 0),
        bounceRate: percentage(stats.bounces ?? stats.bounceRate ?? 0),
        avgVisitTime: Number(stats.totaltime ?? stats.avgVisitTime ?? 0),
      },
      referrers: normalizeMetricRows(referrers),
      devices: {
        browsers: normalizeMetricRows(browsers),
        devices: normalizeMetricRows(devices),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Unable to fetch overview analytics." });
  }
}
