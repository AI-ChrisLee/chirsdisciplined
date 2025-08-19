import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SupabaseAuthProvider } from "@/providers/supabase-auth-provider";
import { GoogleAnalytics } from "./google-analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Violent Morning Protocol - Transform Your Subconscious in 7 Days",
  description: "Reprogram your subconscious mind with The Violent Morning Protocol. A 7-day transformation blueprint for entrepreneurs ready to break through their limits.",
  keywords: "morning routine, subconscious programming, transformation, entrepreneur mindset, violent action, Chris Disciplined",
  authors: [{ name: "Chris Disciplined" }],
  creator: "Chris Disciplined",
  publisher: "Chris Disciplined",
  openGraph: {
    title: "The Violent Morning Protocol - Transform Your Subconscious",
    description: "Reprogram your subconscious mind in 7 days. The morning transformation blueprint for high-performers.",
    url: "https://chrisdisciplined.com",
    siteName: "Chris Disciplined",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Violent Morning Protocol",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Violent Morning Protocol",
    description: "Reprogram your subconscious mind in 7 days.",
    creator: "@chrisdisciplined",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="VMP" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <SupabaseAuthProvider>
          {children}
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
