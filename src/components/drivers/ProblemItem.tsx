"use client";

import { useState } from "react";
import { useSession } from "@/components/session/SessionProvider";
import { SelectableCard } from "@/components/session/SelectableCard";
import { CustomCardAdder } from "@/components/session/CustomCardAdder";
import type { Problem, Card } from "@/lib/types";
import type { DriverMeta } from "@/lib/drivers";

export function ProblemItem({
  problem,
  cards,
  driver,
}: {
  problem: Problem;
  cards: Card[];
  driver: DriverMeta;
}) {
  const [open, setOpen] = useState(false);
  const { isProblemSelected, toggleProblem } = useSession();
  const selected = isProblemSelected(driver.slug, problem.index);

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 border-b select-none ${
          selected ? "border-red-200" : driver.borderClass
        }`}
      >
        <button
          onClick={() => toggleProblem(driver.slug, problem.index, problem.thaiText)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left"
        >
          <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
            selected ? "bg-red-500" : driver.colorClass
          }`} />
          <span className={`text-sm leading-snug transition-colors ${
            selected ? "font-bold text-red-600" : "font-semibold text-gray-700"
          }`}>
            {problem.thaiText}
          </span>
        </button>
        <span className="text-xs text-gray-400 flex-shrink-0">{cards.length} วิธีแก้</span>
        <button
          onClick={() => setOpen((o) => !o)}
          className={`text-gray-400 text-xs flex-shrink-0 transition-transform duration-150 px-1 ${
            open ? "rotate-90" : ""
          }`}
        >
          ▶
        </button>
      </div>

      {open && (
        <div className="flex flex-col pl-4 pt-1 pb-2">
          {cards.map((card) => (
            <SelectableCard
              key={card.index}
              card={card}
              driver={driver}
              problemText={problem.thaiText}
            />
          ))}
          <CustomCardAdder
            driverSlug={driver.slug}
            problemIndex={problem.index}
            problemText={problem.thaiText}
            driver={driver}
          />
        </div>
      )}
    </div>
  );
}
