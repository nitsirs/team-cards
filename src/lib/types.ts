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
  toolExplanation: string | null;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

// Session mode (กระดาษทด) types
export interface SessionSolution {
  id: string;
  source: "db" | "custom";
  actionTitle: string;
  detailedAction: string;
  note: string;
  status: "now" | "later" | "park" | null;
  isDevilsAdvocate: boolean;
}

export interface SessionProblem {
  id: string;
  source: "db" | "custom";
  driverSlug: string | null;
  problemIndex: number | null;
  editedText: string;
  solutions: SessionSolution[];
}

export interface Session {
  clientName: string;
  problems: SessionProblem[];
}

export interface AllData {
  [driverSlug: string]: {
    problems: {
      thaiText: string;
      cards: {
        actionTitle: string;
        detailedAction: string;
        notes: string | null;
      }[];
    }[];
  };
}
