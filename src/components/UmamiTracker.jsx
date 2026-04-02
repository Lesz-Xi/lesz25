import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SCRIPT_ID = "umami-analytics-script";

const trimSlash = (value) => value?.replace(/\/+$/, "") ?? "";

const ensureTrackerScript = ({ websiteId, baseUrl }) => {
  if (!websiteId || !baseUrl || typeof document === "undefined") {
    return;
  }

  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.defer = true;
  script.src = `${baseUrl}/script.js`;
  script.dataset.websiteId = websiteId;
  script.dataset.hostUrl = baseUrl;
  document.head.appendChild(script);
};

const trackRouteChange = (path) => {
  if (typeof window === "undefined" || !window.umami || typeof window.umami.track !== "function") {
    return;
  }

  try {
    window.umami.track((payload) => ({
      ...payload,
      url: path,
      title: document.title,
    }));
  } catch {
    // Ignore tracker runtime errors so public navigation never breaks.
  }
};

const UmamiTracker = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
  const baseUrl = trimSlash(import.meta.env.VITE_UMAMI_BASE_URL);

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    ensureTrackerScript({ websiteId, baseUrl });
  }, [baseUrl, isAdminRoute, websiteId]);

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    const path = `${location.pathname}${location.search}${location.hash}`;
    const timer = window.setTimeout(() => trackRouteChange(path), 250);

    return () => window.clearTimeout(timer);
  }, [isAdminRoute, location.hash, location.pathname, location.search]);

  return null;
};

export default UmamiTracker;
