import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { SessionProvider } from "@/components/session/SessionProvider";
import { FloatingPlanButton } from "@/components/session/FloatingPlanButton";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "คู่มือแก้ปัญหาทีม",
  description: "เรียกดู 189 วิธีแก้ปัญหาทีมใน 7 หมวดหมู่",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <SessionProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-200 mt-8">
            คู่มือแก้ปัญหาทีม
          </footer>
          <FloatingPlanButton />
        </SessionProvider>
      </body>
    </html>
  );
}
