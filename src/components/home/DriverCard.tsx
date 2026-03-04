import Link from "next/link";
import type { DriverMeta } from "@/lib/drivers";

interface DriverCardProps {
  driver: DriverMeta;
  problemCount: number;
  cardCount: number;
}

export function DriverCard({ driver, problemCount, cardCount }: DriverCardProps) {
  return (
    <Link
      href={`/${driver.slug}/`}
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className={`h-1.5 w-full ${driver.colorClass}`} />
      <div className="p-6">
        <div className="text-4xl mb-3">{driver.icon}</div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 leading-snug">
          {driver.thaiName}
        </h2>
        <div className={`inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full ${driver.bgLightClass} ${driver.textClass} font-medium`}>
          <span>{problemCount} ปัญหา</span>
          <span className="opacity-40">·</span>
          <span>{cardCount} การ์ด</span>
        </div>
      </div>
    </Link>
  );
}
