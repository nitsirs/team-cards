import Link from "next/link";
import type { DriverMeta } from "@/lib/drivers";
import type { Problem } from "@/lib/types";

interface ProblemItemProps {
  driver: DriverMeta;
  problem: Problem;
}

export function ProblemItem({ driver, problem }: ProblemItemProps) {
  return (
    <Link
      href={`/${driver.slug}/p${problem.index}/`}
      className="group flex items-center justify-between gap-4 bg-white rounded-xl border border-gray-100 px-5 py-4 hover:shadow-sm hover:border-gray-200 transition-all duration-150"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${driver.colorClass}`} />
        <p className="text-gray-700 text-sm leading-snug">{problem.thaiText}</p>
      </div>
      <div className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${driver.bgLightClass} ${driver.textClass}`}>
        {problem.cardCount} วิธีแก้
      </div>
    </Link>
  );
}
