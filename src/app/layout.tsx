import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Postcard Trip CMS",
  description: "Manage destinations, packages, and itineraries with ease.",
  keywords: ["Travel", "CMS", "Postcard Trip", "Next.js", "Prisma"],
  authors: [{ name: "Amit Kumar" }],
  openGraph: {
    title: "Postcard Trip CMS",
    description: "A modern travel CMS built with Next.js 15 + Prisma.",
    url: "https://postcardtrip.com",
    siteName: "Postcard Trip",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Postcard Trip CMS",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {children}
        <Toaster
          position="top-center"
          richColors
          expand={true}
          duration={3000}
          closeButton
        />
      </body>
    </html>
  );
}
