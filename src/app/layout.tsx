import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ThemeRegistry } from "@/components/providers/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "관리자 대시보드",
  description: "관리자 대시보드 - 권한 관리 시스템",
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
