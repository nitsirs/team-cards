"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const STORAGE_KEY = "workshop-session-v1";

export interface SelectedCard {
  id: string;
  driverSlug: string;
  problemIndex: number;
  cardIndex: number;
  editedTitle: string;
  editedDetail: string;
  note: string;
  status: "now" | "later" | "park" | null;
}

interface SessionCtx {
  cards: SelectedCard[];
  isSelected: (driverSlug: string, problemIndex: number, cardIndex: number) => boolean;
  getSelectedCard: (driverSlug: string, problemIndex: number, cardIndex: number) => SelectedCard | undefined;
  toggleCard: (base: {
    driverSlug: string;
    problemIndex: number;
    cardIndex: number;
    actionTitle: string;
    detailedAction: string;
  }) => void;
  updateCard: (id: string, updates: Partial<SelectedCard>) => void;
  clearAll: () => void;
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

export function SessionProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<SelectedCard[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCards(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch {}
  }, [cards]);

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
    (base: { driverSlug: string; problemIndex: number; cardIndex: number; actionTitle: string; detailedAction: string }) => {
      const id = makeId(base.driverSlug, base.problemIndex, base.cardIndex);
      setCards((prev) => {
        if (prev.some((c) => c.id === id)) return prev.filter((c) => c.id !== id);
        return [
          ...prev,
          { id, driverSlug: base.driverSlug, problemIndex: base.problemIndex, cardIndex: base.cardIndex, editedTitle: base.actionTitle, editedDetail: base.detailedAction, note: "", status: null },
        ];
      });
    },
    []
  );

  const updateCard = useCallback((id: string, updates: Partial<SelectedCard>) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const clearAll = useCallback(() => setCards([]), []);

  return (
    <Ctx.Provider value={{ cards, isSelected, getSelectedCard, toggleCard, updateCard, clearAll }}>
      {children}
    </Ctx.Provider>
  );
}
