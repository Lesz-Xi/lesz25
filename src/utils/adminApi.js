const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const fetchAdminJson = async (path, accessToken) => {
  const response = await fetch(path, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = await parseJsonSafely(response);

  if (!response.ok) {
    const error = new Error(body.error || "Admin request failed.");
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
};

export const fetchDashboardPayload = async (accessToken) => {
  const [session, overview, pages, realtime] = await Promise.all([
    fetchAdminJson("/api/admin/session", accessToken),
    fetchAdminJson("/api/admin/analytics/overview", accessToken),
    fetchAdminJson("/api/admin/analytics/pages", accessToken),
    fetchAdminJson("/api/admin/analytics/realtime", accessToken),
  ]);

  return {
    session,
    overview: overview.overview,
    referrers: overview.referrers ?? [],
    devices: overview.devices ?? {},
    topPages: pages.pages ?? [],
    realtime: realtime.realtime,
  };
};
