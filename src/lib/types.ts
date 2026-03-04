export interface Problem {
  index: number;
  thaiText: string;
  cardCount: number;
}

export interface Card {
  index: number;
  driverSlug: string;
  problemIndex: number;
  actionTitle: string;
  detailedAction: string;
  notes: string | null;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}
