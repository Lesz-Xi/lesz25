import React, { useEffect, useMemo, useState } from "react";
import { Activity, Chrome, ExternalLink, Globe, LogOut, Monitor, RefreshCw, ShieldCheck, UserRound } from "lucide-react";
import { fetchDashboardPayload } from "../../utils/adminApi";
import { getSupabaseClient, getSupabaseConfig } from "../../utils/supabaseClient";

const REFRESH_INTERVAL_MS = 60_000;
const cardClassName = "rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.35)]";
const numberFormatter = new Intl.NumberFormat("en-US");

const formatMetric = (value) => numberFormatter.format(Number(value ?? 0));

const MetricCard = ({ icon, label, value, helper }) => {
  const Icon = icon;

  return (
    <div className={`${cardClassName} p-6`}>
      <div className="flex items-center justify-between">
        <span className="font-geist-mono text-[10px] uppercase tracking-[0.24em] text-[#C7B580]/75">{label}</span>
        <Icon className="h-4 w-4 text-[#C7B580]" strokeWidth={1.8} />
      </div>
      <div className="mt-6 text-4xl font-display text-white">{formatMetric(value)}</div>
      <p className="mt-3 text-sm text-white/55">{helper}</p>
    </div>
  );
};

const ListPanel = ({ title, icon, rows, emptyCopy }) => {
  const Icon = icon;

  return (
    <div className={`${cardClassName} p-6`}>
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-[#C7B580]" strokeWidth={1.8} />
        <h2 className="font-display text-xl text-white">{title}</h2>
      </div>

      <div className="mt-6 space-y-3">
        {rows.length ? (
          rows.map((row, index) => (
            <div
              key={`${row.label}-${index}`}
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
            >
              <div className="min-w-0 pr-4">
                <p className="truncate text-sm text-white/85">{row.label}</p>
              </div>
              <span className="font-geist-mono text-xs uppercase tracking-[0.16em] text-[#C7B580]">
                {formatMetric(row.value)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-white/45">{emptyCopy}</p>
        )}
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [authState, setAuthState] = useState("loading");
  const [dashboardState, setDashboardState] = useState("idle");
  const [session, setSession] = useState(null);
  const [owner, setOwner] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = useMemo(() => getSupabaseClient(), []);
  const { allowedEmail, redirectUrl, url, anonKey } = getSupabaseConfig();
  const isConfigured = Boolean(url && anonKey && allowedEmail);

  const loadDashboard = async (nextSession, { silent = false } = {}) => {
    if (!nextSession?.access_token) {
      setDashboard(null);
      setDashboardState("idle");
      return;
    }

    if (!silent) {
      setDashboardState("loading");
    }

    try {
      const payload = await fetchDashboardPayload(nextSession.access_token);
      setOwner(payload.session.user);
      setDashboard(payload);
      setAuthState("authorized");
      setDashboardState("ready");
      setErrorMessage("");
    } catch (error) {
      if (error.status === 401) {
        setAuthState("signed_out");
        setDashboard(null);
        setSession(null);
        setDashboardState("idle");
      } else if (error.status === 403) {
        setAuthState("unauthorized");
        setDashboard(null);
        setDashboardState("idle");
      } else {
        setDashboardState("error");
        setErrorMessage(error.message || "Unable to load analytics.");
      }
    }
  };

  useEffect(() => {
    if (!isConfigured || !supabase) {
      setAuthState("misconfigured");
      return;
    }

    let active = true;

    const bootstrap = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      if (error) {
        setAuthState("error");
        setErrorMessage(error.message || "Unable to restore your admin session.");
        return;
      }

      const nextSession = data.session;
      setSession(nextSession);

      if (!nextSession) {
        setAuthState("signed_out");
        return;
      }

      await loadDashboard(nextSession);
    };

    bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) {
        return;
      }

      setSession(nextSession);

      if (!nextSession) {
        setAuthState("signed_out");
        setDashboard(null);
        setOwner(null);
        setDashboardState("idle");
        return;
      }

      void loadDashboard(nextSession);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [isConfigured, supabase]);

  useEffect(() => {
    if (authState !== "authorized" || !session?.access_token) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      void loadDashboard(session, { silent: true });
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [authState, session]);

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      setAuthState("misconfigured");
      return;
    }

    setErrorMessage("");

    const destination = redirectUrl || `${window.location.origin}/admin`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: destination,
      },
    });

    if (error) {
      setAuthState("error");
      setErrorMessage(error.message || "Google sign-in failed.");
    }
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setSession(null);
    setOwner(null);
    setDashboard(null);
    setAuthState("signed_out");
    setDashboardState("idle");
  };

  const refreshDashboard = async () => {
    if (session) {
      await loadDashboard(session);
    }
  };

  const summary = dashboard?.overview ?? {};
  const referrers = dashboard?.referrers ?? [];
  const topPages = dashboard?.topPages ?? [];
  const browserRows = dashboard?.devices?.browsers ?? [];
  const deviceRows = dashboard?.devices?.devices ?? [];
  const realtime = dashboard?.realtime ?? {};

  if (authState === "misconfigured") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#070707] px-6 py-12 text-white md:px-10">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-[#C7B580]/20 bg-[#0B0B0D]/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <p className="font-geist-mono text-[10px] uppercase tracking-[0.3em] text-[#C7B580]/75">Admin setup required</p>
          <h1 className="mt-4 font-display text-4xl text-white">Missing environment variables</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65">
            Configure Supabase and the allowed owner email before this private dashboard can be used.
          </p>
          <div className="mt-8 rounded-3xl border border-white/10 bg-black/30 p-5">
            <p className="font-geist-mono text-xs uppercase tracking-[0.16em] text-[#C7B580]">
              Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ADMIN_ALLOWED_EMAIL
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (authState === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070707] px-6">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border border-[#C7B580]/20 border-t-[#C7B580]" />
          <p className="font-geist-mono text-xs uppercase tracking-[0.24em] text-[#C7B580]/75">Verifying admin session</p>
        </div>
      </main>
    );
  }

  if (authState === "signed_out" || authState === "error") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#070707] px-6 py-12 text-white md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(199,181,128,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <section className="rounded-[34px] border border-white/10 bg-[#0B0B0D]/80 p-8 backdrop-blur-2xl md:p-12">
              <p className="font-geist-mono text-[10px] uppercase tracking-[0.32em] text-[#C7B580]/75">Owner-only analytics</p>
              <h1 className="mt-6 max-w-2xl font-display text-5xl leading-[0.95] text-white md:text-7xl">
                Private traffic intelligence for your portfolio.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/62 md:text-lg">
                Sign in with the Google account you approved for this project. The dashboard stays read-only,
                private, and limited to anonymous aggregate analytics only.
              </p>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#C7B580]/30 bg-[#C7B580]/10 px-6 py-3 font-geist-mono text-xs uppercase tracking-[0.24em] text-[#F5F2EB] transition hover:bg-[#C7B580]/18"
              >
                <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
                Continue with Google
              </button>
              {errorMessage ? (
                <p className="mt-5 text-sm text-rose-300">{errorMessage}</p>
              ) : null}
            </section>

            <aside className={`${cardClassName} p-8`}>
              <p className="font-geist-mono text-[10px] uppercase tracking-[0.28em] text-[#C7B580]/75">Access rules</p>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/65">
                <p>Only the configured owner email can receive analytics responses from the server.</p>
                <p>The browser never receives the Umami API key or calls the analytics provider directly.</p>
                <p>Visitors remain anonymous. This panel is for aggregate traffic insight only.</p>
              </div>
              <div className="mt-8 rounded-3xl border border-white/10 bg-black/25 p-5">
                <p className="font-geist-mono text-[10px] uppercase tracking-[0.2em] text-[#C7B580]">Expected owner</p>
                <p className="mt-2 break-all text-sm text-white/85">{allowedEmail}</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    );
  }

  if (authState === "unauthorized") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070707] px-6 text-white">
        <div className="max-w-xl rounded-[30px] border border-rose-500/25 bg-[#0B0B0D]/85 p-8 text-center backdrop-blur-xl">
          <p className="font-geist-mono text-[10px] uppercase tracking-[0.28em] text-rose-300">Access denied</p>
          <h1 className="mt-4 font-display text-4xl text-white">This Google account is not approved.</h1>
          <p className="mt-4 text-base leading-relaxed text-white/65">
            Sign out and authenticate with the owner account configured for this dashboard.
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 font-geist-mono text-xs uppercase tracking-[0.22em] text-white transition hover:bg-white/[0.1]"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 rounded-[34px] border border-white/10 bg-[#0B0B0D]/78 p-7 backdrop-blur-2xl md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="font-geist-mono text-[10px] uppercase tracking-[0.32em] text-[#C7B580]/75">Owner analytics console</p>
            <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">Portfolio traffic, privately.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
              Aggregate anonymous reporting from Umami, served only after server-side owner verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/10 bg-black/25 px-4 py-2">
              <p className="font-geist-mono text-[10px] uppercase tracking-[0.18em] text-[#C7B580]">Owner</p>
              <p className="mt-1 text-sm text-white/80">{owner?.email || session?.user?.email}</p>
            </div>
            <button
              type="button"
              onClick={refreshDashboard}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 font-geist-mono text-[11px] uppercase tracking-[0.22em] text-white/80 transition hover:bg-white/[0.09]"
            >
              <RefreshCw className={`h-4 w-4 ${dashboardState === "loading" ? "animate-spin" : ""}`} strokeWidth={1.8} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-[#C7B580]/20 bg-[#C7B580]/8 px-4 py-3 font-geist-mono text-[11px] uppercase tracking-[0.22em] text-[#F5F2EB] transition hover:bg-[#C7B580]/15"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.8} />
              Sign out
            </button>
          </div>
        </div>

        {dashboardState === "error" ? (
          <div className="mt-6 rounded-[28px] border border-rose-500/20 bg-rose-500/8 p-5 text-sm text-rose-200">
            {errorMessage || "Unable to load analytics data from the secure API."}
          </div>
        ) : null}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={UserRound} label="Visitors" value={summary.visitors} helper="Unique visitors in the active reporting window." />
          <MetricCard icon={Activity} label="Page views" value={summary.pageviews} helper="Total page views tracked through Umami." />
          <MetricCard icon={ExternalLink} label="Bounce rate" value={summary.bounceRate} helper="Share of visits that left after a single page." />
          <MetricCard icon={ShieldCheck} label="Active now" value={realtime.activeVisitors} helper="Visitors currently active on the site." />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr,0.85fr]">
          <div className={`${cardClassName} p-6`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-geist-mono text-[10px] uppercase tracking-[0.24em] text-[#C7B580]/75">Realtime snapshot</p>
                <h2 className="mt-3 font-display text-2xl text-white">Last 30 minutes</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-black/25 px-4 py-2">
                <p className="font-geist-mono text-[10px] uppercase tracking-[0.18em] text-[#C7B580]">Updated</p>
                <p className="mt-1 text-sm text-white/80">{realtime.generatedAt ? new Date(realtime.generatedAt).toLocaleTimeString() : "Waiting..."}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="font-geist-mono text-[10px] uppercase tracking-[0.18em] text-[#C7B580]/75">Visitors</p>
                <p className="mt-4 font-display text-4xl text-white">{formatMetric(realtime.last30MinutesVisitors)}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="font-geist-mono text-[10px] uppercase tracking-[0.18em] text-[#C7B580]/75">Page views</p>
                <p className="mt-4 font-display text-4xl text-white">{formatMetric(realtime.last30MinutesPageviews)}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="font-geist-mono text-[10px] uppercase tracking-[0.18em] text-[#C7B580]/75">Average visit</p>
                <p className="mt-4 font-display text-4xl text-white">{formatMetric(summary.avgVisitTime)}</p>
                <p className="mt-2 text-xs text-white/45">seconds</p>
              </div>
            </div>
          </div>

          <div className={`${cardClassName} p-6`}>
            <p className="font-geist-mono text-[10px] uppercase tracking-[0.24em] text-[#C7B580]/75">Trust boundary</p>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/62">
              <p>The browser authenticates with Supabase, but analytics data is only served after server-side owner verification.</p>
              <p>Umami credentials remain server-only, so viewing source or client requests cannot reveal your analytics key.</p>
              <p>Tracking remains anonymous. This dashboard intentionally excludes Gmail, username, or per-visitor identity.</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <ListPanel title="Top pages" icon={Globe} rows={topPages} emptyCopy="No tracked page data yet." />
          <ListPanel title="Top referrers" icon={ExternalLink} rows={referrers} emptyCopy="No referrer data yet." />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <ListPanel title="Browsers" icon={Chrome} rows={browserRows} emptyCopy="No browser distribution data yet." />
          <ListPanel title="Devices" icon={Monitor} rows={deviceRows} emptyCopy="No device distribution data yet." />
        </div>
      </div>
    </main>
  );
};

export default AdminPage;
