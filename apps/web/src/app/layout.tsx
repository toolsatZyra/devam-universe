import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Devam",
  title: "Devam — The Living Atlas",
  description:
    "Explore the stories, traditions, places, practices, and wisdom of Sanatana Dharma.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/brand/devam-mark.png",
    apple: "/brand/devam-mark.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Devam",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#080b18",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
