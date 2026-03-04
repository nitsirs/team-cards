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
      className="group flex items-center gap-4 bg-white rounded-xl border border-gray-100 px-4 py-3.5 hover:shadow-sm hover:border-gray-200 transition-all duration-150"
    >
      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${driver.colorClass}`} />
      <span className="text-2xl flex-shrink-0">{driver.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-gray-800 text-sm">{driver.englishName}</span>
          <span className="text-xs text-gray-400">{driver.thaiName}</span>
        </div>
        <p className="text-xs text-gray-400 leading-snug mt-0.5">{driver.diagnostic}</p>
      </div>
      <div className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${driver.bgLightClass} ${driver.textClass}`}>
        {cardCount} วิธีแก้
      </div>
    </Link>
  );
}
