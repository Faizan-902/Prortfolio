import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-seven-olive-11.vercel.app"),
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
    <html lang="en">
      <head>
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
