import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "@/components/chatbot/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Shreepathy & Co — Bakery & Food Ingredients Wholesale",
    template: "%s | Shreepathy & Co",
  },
  description:
    "Wholesale supplier of bakery raw materials, food ingredients, mojito syrups, milk products, frozen foods and more. Browse the catalog and order via WhatsApp.",
  openGraph: {
    title: "Shreepathy & Co",
    description: "Bakery & food ingredients wholesale.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
