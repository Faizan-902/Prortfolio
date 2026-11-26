import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const themeInitScript = `(function(){try{var t=localStorage.getItem("faizan-theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Mohd Faizan Khan — Software Engineer",
  description:
    "Software engineering student building thoughtful systems, AI applications, and developer tools. Explore PulseCheck, SyncTone, InternIQ, and EnvGuard.",
  keywords: [
    "Mohd Faizan Khan",
    "Software Engineer",
    "Full Stack Developer",
    "Next.js",
    "React",
    "Python",
    "Portfolio",
  ],
  authors: [{ name: "Mohd Faizan Khan" }],
  alternates: { canonical: "/" },
  twitter: {
    card: "summary_large_image",
    title: "Mohd Faizan Khan — Software Engineer",
    description:
      "Algorithms to applications. Selected engineering work, built with intent.",
  },
  openGraph: {
    title: "Mohd Faizan Khan — Software Engineer",
    description:
      "Algorithms to applications. Selected engineering work, built with intent.",
    url: "/",
    siteName: "Mohd Faizan Khan — Portfolio",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link
          rel="preload"
          href="/media/fonts/space-grotesk.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/media/fonts/dm-mono-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/media/fonts/inter-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
