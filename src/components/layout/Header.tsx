import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center">
        <Link href="/" className="text-lg font-bold text-gray-800 hover:text-gray-600 transition-colors">
          คู่มือแก้ปัญหาทีม
        </Link>
      </div>
    </header>
  );
}
