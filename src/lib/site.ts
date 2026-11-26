const DEFAULT_SITE_URL = "https://prortfolio-rho.vercel.app";

/** Resolve canonical public site URL across local, preview, and Vercel production builds. */
export function getSiteUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!configured) return DEFAULT_SITE_URL;
  const trimmed = configured.replace(/\/+$/, "");
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}
