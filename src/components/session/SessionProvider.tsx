"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const STORAGE_KEY = "workshop-session-v2";
const PROBLEMS_KEY = "workshop-problems-v1";
const USER_ID_KEY = "workshop-user-id";

const FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSfBvm_dCg5fVlJigpaKmfQRNZfvtKmhP6DV8RztXbt1ThS9DQ/formResponse";

function getOrCreateUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

function submitProblemVote(problemText: string, userId: string) {
  const body = new URLSearchParams({
    "entry.1146130015": problemText,
    "entry.1300224680": userId,
  });
  fetch(FORM_ACTION, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  }).catch(() => {}); // fire-and-forget
}

export interface SelectedCard {
  id: string;
  driverSlug: string;
  problemIndex: number;
  cardIndex: number;       // -1 for custom cards
  problemText: string;
  isCustom?: boolean;
  editedTitle: string;
  editedDetail: string;
  note: string;
  status: "easy" | "medium" | "hard" | null;
}

interface SessionCtx {
  cards: SelectedCard[];
  isSelected: (driverSlug: string, problemIndex: number, cardIndex: number) => boolean;
  getSelectedCard: (driverSlug: string, problemIndex: number, cardIndex: number) => SelectedCard | undefined;
  toggleCard: (base: {
    driverSlug: string;
    problemIndex: number;
    cardIndex: number;
    problemText: string;
    actionTitle: string;
    detailedAction: string;
  }) => void;
  addCustomCard: (driverSlug: string, problemIndex: number, problemText: string, title: string) => void;
  updateCard: (id: string, updates: Partial<SelectedCard>) => void;
  removeCard: (id: string) => void;
  clearAll: () => void;
  // Problem voting
  selectedProblems: string[];
  isProblemSelected: (driverSlug: string, problemIndex: number) => boolean;
  toggleProblem: (driverSlug: string, problemIndex: number, problemText: string) => void;
}

const Ctx = createContext<SessionCtx | null>(null);

export function useSession() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSession must be within SessionProvider");
  return ctx;
}

function makeId(driverSlug: string, problemIndex: number, cardIndex: number) {
  return `${driverSlug}-p${problemIndex}-c${cardIndex}`;
}

function makeProblemId(driverSlug: string, problemIndex: number) {
  return `${driverSlug}-p${problemIndex}`;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<SelectedCard[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCards(JSON.parse(stored));
    } catch {}
    try {
      const storedProblems = localStorage.getItem(PROBLEMS_KEY);
      if (storedProblems) setSelectedProblems(JSON.parse(storedProblems));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cards)); } catch {}
  }, [cards]);

  useEffect(() => {
    try { localStorage.setItem(PROBLEMS_KEY, JSON.stringify(selectedProblems)); } catch {}
  }, [selectedProblems]);

  const isSelected = useCallback(
    (driverSlug: string, problemIndex: number, cardIndex: number) =>
      cards.some((c) => c.id === makeId(driverSlug, problemIndex, cardIndex)),
    [cards]
  );

  const getSelectedCard = useCallback(
    (driverSlug: string, problemIndex: number, cardIndex: number) =>
      cards.find((c) => c.id === makeId(driverSlug, problemIndex, cardIndex)),
    [cards]
  );

  const toggleCard = useCallback(
    (base: {
      driverSlug: string;
      problemIndex: number;
      cardIndex: number;
      problemText: string;
      actionTitle: string;
      detailedAction: string;
    }) => {
      const id = makeId(base.driverSlug, base.problemIndex, base.cardIndex);
      setCards((prev) => {
        if (prev.some((c) => c.id === id)) return prev.filter((c) => c.id !== id);
        return [
          ...prev,
          {
            id,
            driverSlug: base.driverSlug,
            problemIndex: base.problemIndex,
            cardIndex: base.cardIndex,
            problemText: base.problemText,
            editedTitle: base.actionTitle,
            editedDetail: base.detailedAction,
            note: "",
            status: null,
          },
        ];
      });
    },
    []
  );

  const addCustomCard = useCallback(
    (driverSlug: string, problemIndex: number, problemText: string, title: string) => {
      const id = `${driverSlug}-p${problemIndex}-custom-${Date.now()}`;
      setCards((prev) => [
        ...prev,
        {
          id,
          driverSlug,
          problemIndex,
          cardIndex: -1,
          problemText,
          isCustom: true,
          editedTitle: title,
          editedDetail: "",
          note: "",
          status: null,
        },
      ]);
    },
    []
  );

  const updateCard = useCallback((id: string, updates: Partial<SelectedCard>) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const removeCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearAll = useCallback(() => setCards([]), []);

  const isProblemSelected = useCallback(
    (driverSlug: string, problemIndex: number) =>
      selectedProblems.includes(makeProblemId(driverSlug, problemIndex)),
    [selectedProblems]
  );

  const toggleProblem = useCallback(
    (driverSlug: string, problemIndex: number, problemText: string) => {
      const id = makeProblemId(driverSlug, problemIndex);
      const isCurrentlySelected = selectedProblems.includes(id);
      // Side effect outside the setter — React Strict Mode won't double-invoke this
      if (!isCurrentlySelected) {
        const userId = getOrCreateUserId();
        submitProblemVote(problemText, userId);
      }
      setSelectedProblems((prev) =>
        prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      );
    },
    [selectedProblems]
  );

  return (
    <Ctx.Provider value={{
      cards, isSelected, getSelectedCard, toggleCard, addCustomCard, updateCard, removeCard, clearAll,
      selectedProblems, isProblemSelected, toggleProblem,
    }}>
      {children}
    </Ctx.Provider>
  );
}
