import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mystrymsg.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "MystryMsg - Anonymous Messages",
    template: "%s | MystryMsg",
  },
  description: "Send and receive anonymous messages with AI-powered suggestions",
  applicationName: "MystryMsg",
  keywords: [
    "anonymous messages",
    "feedback",
    "Next.js",
    "TypeScript",
    "NextAuth",
    "MongoDB",
  ],
  authors: [{ name: "Ganesh Lonare" }],
  creator: "Ganesh Lonare",
  publisher: "MystryMsg",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: baseUrl,
    title: "MystryMsg - Anonymous Messages",
    description: "Send and receive anonymous messages with AI-powered suggestions",
    siteName: "MystryMsg",
    images: [
      {
        url: "/home/image.png",
        width: 1200,
        height: 630,
        alt: "MystryMsg - Anonymous Messages",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MystryMsg - Anonymous Messages",
    description: "Send and receive anonymous messages with AI-powered suggestions",
    images: ["/home/image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/home/image.png", type: "image/png" },
    ],
    apple: [{ url: "/home/image.png" }],
  },
  category: "social",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black min-h-screen`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
