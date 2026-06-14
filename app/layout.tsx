import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://tommypicsuptrash.org"),
  title: "Tommy Picks Up Trash — Cleaning the Ohio River & Stevenson Creek",
  description:
    "Tom Ross has pulled tens of thousands of pounds of litter from Pittsburgh's Ohio River and Clearwater's Stevenson Creek — one kayak, one bag at a time. Follow the count and join the cause.",
  openGraph: {
    title: "Tommy Picks Up Trash",
    description:
      "One person, one kayak, cleaner water. Follow the live trash-bag count from the Ohio River and Stevenson Creek.",
    type: "website",
  },
  twitter: { card: "summary_large_image", creator: "@TommyPicsUpTrash" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
