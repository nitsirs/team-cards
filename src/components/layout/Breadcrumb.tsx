import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/types";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-300">›</span>}
          {i === items.length - 1 ? (
            <span className="text-gray-700 font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-gray-800 transition-colors">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
