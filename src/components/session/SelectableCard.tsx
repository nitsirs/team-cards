"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "./SessionProvider";
import type { Card } from "@/lib/types";
import type { DriverMeta } from "@/lib/drivers";

const STATUS_CONFIG = {
  now:   { label: "ทำเลย",     className: "bg-green-100 text-green-700" },
  later: { label: "เก็บไว้",   className: "bg-yellow-100 text-yellow-700" },
  park:  { label: "ไม่เหมาะ",  className: "bg-gray-100 text-gray-400" },
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

export function SelectableCard({ card, driver }: { card: Card; driver: DriverMeta }) {
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
            🔧 {card.notes}
          </span>
        )}

        {/* Status pill (only when selected) */}
        {selected && sc && (
          <button
            onClick={() => {
              const next = sc.status === null ? "now" : sc.status === "now" ? "later" : sc.status === "later" ? "park" : null;
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
                {(["now", "later", "park"] as const).map((s) => (
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
