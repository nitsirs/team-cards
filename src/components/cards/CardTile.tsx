import Link from "next/link";
import type { DriverMeta } from "@/lib/drivers";
import type { Card } from "@/lib/types";

interface CardTileProps {
  driver: DriverMeta;
  card: Card;
}

export function CardTile({ driver, card }: CardTileProps) {
  const href = `/${driver.slug}/p${card.problemIndex}/c${card.index}/`;
  return (
    <Link
      href={href}
      className={`group bg-white rounded-xl border-l-4 ${driver.borderClass} border border-gray-100 border-l-[4px] p-5 hover:shadow-md transition-all duration-150 hover:-translate-y-0.5 flex flex-col gap-2`}
    >
      <h3 className="font-semibold text-gray-800 text-sm leading-snug">
        {card.actionTitle}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
        {card.detailedAction}
      </p>
      {card.notes && (
        <div className={`mt-1 text-xs font-medium px-2 py-0.5 rounded self-start ${driver.bgLightClass} ${driver.textClass}`}>
          📌 {card.notes}
        </div>
      )}
    </Link>
  );
}
