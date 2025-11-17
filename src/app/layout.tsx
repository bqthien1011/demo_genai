import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProductProvider } from "@/lib/context/ProductContext";
import { ConversationProvider } from "@/lib/context/ConversationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nhẫn Kim cương Vàng 14K PNJ Masterpiece DDMXH000001",
  description: "Nhẫn Kim cương Vàng 14K PNJ Masterpiece DDMXH000001",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased p-4`}
      >
        <ConversationProvider>
          <ProductProvider>{children}</ProductProvider>
        </ConversationProvider>
      </body>
    </html>
  );
}
