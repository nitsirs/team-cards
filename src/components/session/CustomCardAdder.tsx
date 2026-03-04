"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, type SelectedCard } from "./SessionProvider";
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

function CustomCardItem({ sc, driver }: { sc: SelectedCard; driver: DriverMeta }) {
  const { updateCard, removeCard } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-b border-gray-50 last:border-0 border-l-2 ${driver.borderClass}`}>
      <div className="flex items-center gap-2 py-1.5 min-w-0">
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-gray-300 text-xs flex-shrink-0 transition-transform duration-150"
          style={{ transform: open ? "rotate(90deg)" : "none" }}
        >
          ▶
        </button>
        <span className={`text-sm flex-1 leading-snug font-bold ${driver.textClass}`}>
          {sc.editedTitle}
        </span>
        <button
          onClick={() => {
            const next = sc.status === null ? "easy" : sc.status === "easy" ? "medium" : sc.status === "medium" ? "hard" : null;
            updateCard(sc.id, { status: next });
          }}
          className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full transition-colors ${sc.status ? STATUS_CONFIG[sc.status].className : "text-gray-300 hover:text-gray-500"}`}
        >
          {sc.status ? STATUS_CONFIG[sc.status].label : "○"}
        </button>
        <button
          onClick={() => removeCard(sc.id)}
          className="flex-shrink-0 text-gray-300 hover:text-red-400 text-xs transition-colors px-0.5"
        >
          ✕
        </button>
      </div>

      {open && (
        <div className="ml-5 pb-3 border-l-2 border-gray-100 pl-3">
          <AutoTextarea
            value={sc.editedTitle}
            onChange={(v) => updateCard(sc.id, { editedTitle: v })}
            placeholder="ชื่อวิธีแก้..."
            className={`w-full text-sm font-bold bg-transparent outline-none placeholder:text-gray-300 leading-snug ${driver.textClass}`}
          />
          <AutoTextarea
            value={sc.editedDetail}
            onChange={(v) => updateCard(sc.id, { editedDetail: v })}
            placeholder="รายละเอียด..."
            className="w-full text-xs text-gray-500 bg-transparent outline-none placeholder:text-gray-300 leading-relaxed mt-1"
          />
          <div className="flex items-start gap-1.5 mt-2">
            <span className="text-gray-300 text-xs flex-shrink-0 mt-0.5">📝</span>
            <AutoTextarea
              value={sc.note}
              onChange={(v) => updateCard(sc.id, { note: v })}
              placeholder="บันทึก..."
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
        </div>
      )}
    </div>
  );
}

export function CustomCardAdder({
  driverSlug,
  problemIndex,
  problemText,
  driver,
}: {
  driverSlug: string;
  problemIndex: number;
  problemText: string;
  driver: DriverMeta;
}) {
  const { cards, addCustomCard } = useSession();
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const customCards = cards.filter(
    (c) => c.driverSlug === driverSlug && c.problemIndex === problemIndex && c.isCustom
  );

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  function handleAdd() {
    if (!text.trim()) return;
    addCustomCard(driverSlug, problemIndex, problemText, text.trim());
    setText("");
    setAdding(false);
  }

  return (
    <div className="mt-0.5">
      {customCards.map((c) => (
        <CustomCardItem key={c.id} sc={c} driver={driver} />
      ))}

      {adding ? (
        <div className="flex items-center gap-2 py-1.5 pl-5">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") { setAdding(false); setText(""); }
            }}
            placeholder="ไอเดียของคุณ..."
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-300 text-gray-700"
          />
          <button
            onClick={handleAdd}
            className={`text-xs px-2.5 py-1 rounded-full ${driver.bgLightClass} ${driver.textClass} flex-shrink-0`}
          >
            เพิ่ม
          </button>
          <button
            onClick={() => { setAdding(false); setText(""); }}
            className="text-xs text-gray-300 hover:text-gray-500 flex-shrink-0"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 py-1.5 pl-5 text-xs text-gray-300 hover:text-gray-500 transition-colors"
        >
          <span>＋</span>
          <span>เพิ่มไอเดียเอง</span>
        </button>
      )}
    </div>
  );
}
