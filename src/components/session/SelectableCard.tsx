"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "./SessionProvider";
import type { Card } from "@/lib/types";
import type { DriverMeta } from "@/lib/drivers";

const STATUS_CONFIG = {
  easy:   { label: "ง่าย",  className: "bg-green-100 text-green-700" },
  medium: { label: "กลาง",  className: "bg-yellow-100 text-yellow-700" },
  hard:   { label: "ยาก",   className: "bg-red-100 text-red-700" },
} as const;

function AutoTextarea({ value, onChange, placeholder, className }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`resize-none overflow-hidden ${className ?? ""}`}
    />
  );
}

export function SelectableCard({ card, driver, problemText }: { card: Card; driver: DriverMeta; problemText: string }) {
  const { isSelected, getSelectedCard, toggleCard, updateCard } = useSession();
  const [open, setOpen] = useState(false);

  const selected = isSelected(card.driverSlug, card.problemIndex, card.index);
  const sc = getSelectedCard(card.driverSlug, card.problemIndex, card.index);

  return (
    <div className={`border-b border-gray-50 last:border-0 ${selected ? `border-l-2 ${driver.borderClass}` : ""}`}>
      {/* Summary row */}
      <div className="flex items-center gap-2 py-1.5 min-w-0">
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-gray-300 text-xs flex-shrink-0 transition-transform duration-150"
          style={{ transform: open ? "rotate(90deg)" : "none" }}
        >
          ▶
        </button>

        <span className={`text-sm flex-1 leading-snug ${selected ? `font-bold ${driver.textClass}` : "font-semibold text-gray-800"}`}>
          {sc?.editedTitle ?? card.actionTitle}
        </span>

        {card.notes && (
          <span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded ${driver.bgLightClass} ${driver.textClass}`}>
            🔧 tool
          </span>
        )}

        {/* Difficulty pill (only when selected) */}
        {selected && sc && (
          <button
            onClick={() => {
              const next = sc.status === null ? "easy" : sc.status === "easy" ? "medium" : sc.status === "medium" ? "hard" : null;
              updateCard(sc.id, { status: next });
            }}
            className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full transition-colors ${sc.status ? STATUS_CONFIG[sc.status].className : "text-gray-300 hover:text-gray-500"}`}
          >
            {sc.status ? STATUS_CONFIG[sc.status].label : "○"}
          </button>
        )}

        {/* Select dot */}
        <button
          onClick={() =>
            toggleCard({
              driverSlug: card.driverSlug,
              problemIndex: card.problemIndex,
              cardIndex: card.index,
              problemText,
              actionTitle: card.actionTitle,
              detailedAction: card.detailedAction,
            })
          }
          className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 transition-all ${
            selected ? `${driver.colorClass} border-transparent` : "border-gray-300 hover:border-gray-500"
          }`}
        />
      </div>

      {/* Expanded content */}
      {open && (
        <div className="ml-5 pb-3 border-l-2 border-gray-100 pl-3">
          {card.notes && (
            <p className={`text-xs mb-1.5 ${driver.textClass}`}>🔧 {card.notes}</p>
          )}
          {selected && sc ? (
            <>
              <AutoTextarea
                value={sc.editedDetail}
                onChange={(v) => updateCard(sc.id, { editedDetail: v })}
                placeholder="รายละเอียด..."
                className="w-full text-xs text-gray-500 bg-transparent outline-none placeholder:text-gray-300 leading-relaxed"
              />
              <div className="flex items-start gap-1.5 mt-2">
                <span className="text-gray-300 text-xs flex-shrink-0 mt-0.5">📝</span>
                <AutoTextarea
                  value={sc.note}
                  onChange={(v) => updateCard(sc.id, { note: v })}
                  placeholder="บันทึก / ไอเดียเพิ่ม..."
                  className="flex-1 text-xs text-gray-400 bg-transparent outline-none placeholder:text-gray-200 leading-relaxed"
                />
              </div>
              <div className="flex gap-1.5 mt-2">
                {(["easy", "medium", "hard"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateCard(sc.id, { status: sc.status === s ? null : s })}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                      sc.status === s ? STATUS_CONFIG[s].className : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {STATUS_CONFIG[s].label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-500 leading-relaxed">{card.detailedAction}</p>
          )}
        </div>
      )}
    </div>
  );
}
