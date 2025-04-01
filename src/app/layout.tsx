import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ThemeRegistry } from "@/components/providers/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "내부 개발자 플랫폼",
  description: "개발자 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ThemeRegistry>
          <NextAuthProvider>
            {children}
          </NextAuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
