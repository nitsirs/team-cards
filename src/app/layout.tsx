import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "การ์ดทีม | คู่มือแก้ปัญหาทีม",
  description: "เรียกดู 189 การ์ดวิธีแก้ปัญหาทีมใน 7 หมวดหมู่",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <div className="flex-1">{children}</div>
        <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-200 mt-8">
          การ์ดทีม — คู่มือแก้ปัญหาทีม
        </footer>
      </body>
    </html>
  );
}
