"use client";

import { useSession, type SelectedCard } from "./SessionProvider";
import { DRIVERS } from "@/lib/drivers";

// Replace with your Google Apps Script Web App URL to enable Sheets posting
const SHEETS_URL = "";

const DIFF_LABEL = { easy: "ง่าย", medium: "กลาง", hard: "ยาก" } as const;
const DIFF_STYLE = {
  easy:   "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard:   "bg-red-100 text-red-700",
} as const;

function buildMailtoBody(cards: SelectedCard[]): string {
  const lines: string[] = [
    "Action Plan",
    `วันที่: ${new Date().toLocaleDateString("th-TH", { dateStyle: "long" })}`,
    "",
  ];

  const byDriver: Record<string, SelectedCard[]> = {};
  for (const c of cards) {
    if (!byDriver[c.driverSlug]) byDriver[c.driverSlug] = [];
    byDriver[c.driverSlug].push(c);
  }

  for (const [slug, driverCards] of Object.entries(byDriver)) {
    const driver = DRIVERS.find((d) => d.slug === slug);
    lines.push(`━━━ ${driver?.thaiName ?? slug} ━━━`);

    const byProblem = new Map<string, SelectedCard[]>();
    for (const c of driverCards) {
      if (!byProblem.has(c.problemText)) byProblem.set(c.problemText, []);
      byProblem.get(c.problemText)!.push(c);
    }

    for (const [problemText, pCards] of byProblem) {
      lines.push(`\n▸ ${problemText}`);
      for (const c of pCards) {
        const diff = c.status ? ` [${DIFF_LABEL[c.status]}]` : "";
        lines.push(`  • ${c.editedTitle}${diff}`);
        if (c.note) lines.push(`    📝 ${c.note}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

async function postToSheets(cards: SelectedCard[]) {
  if (!SHEETS_URL) {
    alert("ยังไม่ได้ตั้งค่า Google Sheets URL");
    return;
  }
  try {
    await fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: new Date().toISOString(), cards }),
    });
    alert("ส่งข้อมูลให้ Facilitator สำเร็จ!");
  } catch {
    alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
  }
}

export function ActionPlanView({ onClose }: { onClose: () => void }) {
  const { cards, clearAll } = useSession();

  const subject = encodeURIComponent(`Action Plan — ${new Date().toLocaleDateString("th-TH")}`);
  const body = encodeURIComponent(buildMailtoBody(cards));
  const mailtoHref = `mailto:?subject=${subject}&body=${body}`;

  // Group by driver → problem
  const driverGroups = DRIVERS.map((driver) => {
    const driverCards = cards.filter((c) => c.driverSlug === driver.slug);
    if (!driverCards.length) return null;

    const byProblem = new Map<string, SelectedCard[]>();
    for (const c of driverCards) {
      if (!byProblem.has(c.problemText)) byProblem.set(c.problemText, []);
      byProblem.get(c.problemText)!.push(c);
    }

    return { driver, problems: Array.from(byProblem.entries()) };
  }).filter(Boolean) as { driver: (typeof DRIVERS)[number]; problems: [string, SelectedCard[]][] }[];

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
        <h2 className="font-bold text-gray-900">Action Plan</h2>
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← กลับ
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {cards.length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-sm">ยังไม่ได้เลือกวิธีแก้</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {driverGroups.map(({ driver, problems }) => (
              <div key={driver.slug} className={`bg-white rounded-2xl border border-gray-100 overflow-hidden border-t-4 ${driver.colorClass}`}>
                <div className="px-4 py-3 flex items-center gap-2">
                  <span>{driver.icon}</span>
                  <span className={`text-sm font-semibold ${driver.textClass}`}>{driver.thaiName}</span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {problems.reduce((n, [, cs]) => n + cs.length, 0)} วิธีแก้
                  </span>
                </div>
                <div className="divide-y divide-gray-50">
                  {problems.map(([problemText, pCards]) => (
                    <div key={problemText}>
                      {/* Problem header */}
                      <div className="px-4 py-2 bg-gray-50">
                        <p className="text-xs text-gray-500 leading-snug">{problemText}</p>
                      </div>
                      {/* Cards */}
                      {pCards.map((c) => (
                        <div key={c.id} className="px-4 py-2.5 flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 leading-snug">{c.editedTitle}</p>
                            {c.note && <p className="text-xs text-gray-400 mt-0.5">📝 {c.note}</p>}
                          </div>
                          {c.status && (
                            <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full mt-0.5 ${DIFF_STYLE[c.status]}`}>
                              {DIFF_LABEL[c.status]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          <a
            href={mailtoHref}
            className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-medium text-center hover:bg-gray-700 transition-colors"
          >
            📧 ส่งให้ตัวเองทางอีเมล
          </a>
          <div className="flex gap-2">
            {SHEETS_URL && (
              <button
                onClick={() => postToSheets(cards)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                📊 ส่งข้อมูลให้ Facilitator
              </button>
            )}
            <button
              onClick={() => { clearAll(); onClose(); }}
              className="flex-1 py-2.5 rounded-xl border border-red-100 text-sm text-red-400 hover:bg-red-50 transition-colors"
            >
              ล้างทั้งหมด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
