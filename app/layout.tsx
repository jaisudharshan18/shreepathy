import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ChatWidget } from "@/components/chatbot/ChatWidget";

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
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
