import type { Metadata, Viewport } from "next";
import { Inter, Lexend } from "next/font/google";
import { ChatbotProvider } from "@/components/chatbot/Chatbot";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CamCCUL — Cameroon Cooperative Credit Union League",
  description:
    "Supervising 220+ credit unions across all 10 regions of Cameroon since 1968.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets fixed elements (e.g. the chatbot bubble) read env(safe-area-inset-*)
  // so they clear the notch/home-indicator area on modern phones instead of
  // sitting under it.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${lexend.variable} h-full antialiased`}
    >
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <LanguageProvider>
          <ChatbotProvider>{children}</ChatbotProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
