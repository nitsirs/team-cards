"use client";

import { useState } from "react";
import { useSession } from "./SessionProvider";
import { ActionPlanView } from "./ActionPlanView";

export function FloatingPlanButton() {
  const { cards } = useSession();
  const [showPlan, setShowPlan] = useState(false);

  if (cards.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setShowPlan(true)}
        className="fixed bottom-6 right-4 z-40 flex items-center gap-2 bg-gray-900 text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:bg-gray-700 transition-all"
      >
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-gray-900 text-xs font-bold flex-shrink-0">
          {cards.length}
        </span>
        <span className="text-sm font-medium">Action Plan</span>
      </button>
      {showPlan && <ActionPlanView onClose={() => setShowPlan(false)} />}
    </>
  );
}
