import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { WebVitals } from "@/components/analytics/WebVitals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BizLevel - Платформа для развития бизнес-навыков",
  description: "BizLevel - онлайн-платформа, которая помогает предпринимателям и руководителям повышать бизнес-навыки через короткие видео, тесты и практические артефакты.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <Providers>
          {children}
          <WebVitals />
        </Providers>
      </body>
    </html>
  );
}
