import { getRequiredEnv } from "./env.js";

const getBaseUrl = () => getRequiredEnv("UMAMI_BASE_URL").replace(/\/+$/, "");
const getWebsiteId = () => getRequiredEnv("UMAMI_WEBSITE_ID");
const getApiKey = () => getRequiredEnv("UMAMI_API_KEY");

const buildUrl = (path, searchParams = {}) => {
  const url = new URL(`${getBaseUrl()}/api${path}`);

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
};

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const umamiRequest = async (path, searchParams = {}) => {
  const response = await fetch(buildUrl(path, searchParams), {
    headers: {
      Accept: "application/json",
      "x-umami-api-key": getApiKey(),
    },
  });

  const body = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(body.message || body.error || "Umami API request failed.");
  }

  return body;
};

const pickMetricLabel = (item) =>
  item?.x ??
  item?.label ??
  item?.url ??
  item?.referrer ??
  item?.browser ??
  item?.device ??
  item?.name ??
  "Unknown";

const pickMetricValue = (item) =>
  Number(
    item?.y ??
      item?.value ??
      item?.total ??
      item?.pageviews ??
      item?.visitors ??
      item?.count ??
      0
  );

export const normalizeMetricRows = (rows = []) =>
  rows.map((item) => ({
    label: pickMetricLabel(item),
    value: pickMetricValue(item),
  }));

export const getOverviewWindow = () => {
  const endAt = Date.now();
  const startAt = endAt - 30 * 24 * 60 * 60 * 1000;

  return { startAt, endAt };
};

export const getRealtimeWindow = () => {
  const endAt = Date.now();
  const startAt = endAt - 30 * 60 * 1000;

  return { startAt, endAt };
};

export const fetchWebsiteStats = async ({ startAt, endAt }) =>
  umamiRequest(`/websites/${getWebsiteId()}/stats`, { startAt, endAt });

export const fetchMetric = async ({ type, startAt, endAt, limit = 5 }) =>
  umamiRequest(`/websites/${getWebsiteId()}/metrics`, { type, startAt, endAt, limit });

export const fetchActiveVisitors = async () =>
  umamiRequest(`/websites/${getWebsiteId()}/active`);
