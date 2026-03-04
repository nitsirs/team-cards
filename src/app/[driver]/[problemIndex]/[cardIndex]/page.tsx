import { notFound } from "next/navigation";
import { DRIVERS, getDriverBySlug } from "@/lib/drivers";
import { getProblems, getCards, getCard } from "@/lib/data";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export async function generateStaticParams() {
  const params: { driver: string; problemIndex: string; cardIndex: string }[] = [];
  for (const driver of DRIVERS) {
    const problems = getProblems(driver.slug);
    for (const problem of problems) {
      const cards = getCards(driver.slug, problem.index);
      for (const card of cards) {
        params.push({
          driver: driver.slug,
          problemIndex: `p${problem.index}`,
          cardIndex: `c${card.index}`,
        });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ driver: string; problemIndex: string; cardIndex: string }>;
}) {
  const { driver: slug, problemIndex, cardIndex } = await params;
  const driver = getDriverBySlug(slug);
  const pIdx = parseInt(problemIndex.replace("p", ""));
  const cIdx = parseInt(cardIndex.replace("c", ""));
  const card = driver ? getCard(driver.slug, pIdx, cIdx) : null;
  return { title: card ? `${card.actionTitle} | คู่มือแก้ปัญหาทีม` : "คู่มือแก้ปัญหาทีม" };
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ driver: string; problemIndex: string; cardIndex: string }>;
}) {
  const { driver: slug, problemIndex, cardIndex } = await params;
  const driver = getDriverBySlug(slug);
  if (!driver) notFound();

  const pIdx = parseInt(problemIndex.replace("p", ""));
  const cIdx = parseInt(cardIndex.replace("c", ""));
  if (isNaN(pIdx) || isNaN(cIdx)) notFound();

  const problems = getProblems(driver.slug);
  const problem = problems[pIdx];
  if (!problem) notFound();

  const card = getCard(driver.slug, pIdx, cIdx);
  if (!card) notFound();

  const allCards = getCards(driver.slug, pIdx);
  const prevCard = allCards[cIdx - 1] ?? null;
  const nextCard = allCards[cIdx + 1] ?? null;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "หน้าแรก", href: "/" },
          { label: driver.thaiName, href: `/${driver.slug}/` },
          { label: `ปัญหาที่ ${pIdx + 1}`, href: `/${driver.slug}/p${pIdx}/` },
        ]}
      />

      <div className={`mt-5 bg-white rounded-2xl shadow-sm border-t-4 ${driver.colorClass} overflow-hidden`}>
        <div className="p-5">
          <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${driver.bgLightClass} ${driver.textClass} mb-3`}>
            <span>{driver.icon}</span>
            <span>{driver.thaiName}</span>
          </div>
          <p className="text-xs text-gray-400 mb-1">วิธีแก้ที่ {cIdx + 1} จาก {allCards.length}</p>
          <h1 className="text-xl font-bold text-gray-900 leading-snug mb-4">{card.actionTitle}</h1>
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">วิธีทำ</p>
            <p className="text-gray-700 text-sm leading-relaxed">{card.detailedAction}</p>
          </div>
          {card.notes && (
            <div className={`rounded-xl p-3 border ${driver.borderClass} ${driver.bgLightClass}`}>
              <p className={`text-xs font-semibold mb-1 ${driver.textClass}`}>📌 เครื่องมือ / อ้างอิง</p>
              <p className={`text-sm font-medium ${driver.textClass}`}>{card.notes}</p>
            </div>
          )}
        </div>

        <div className="flex border-t border-gray-100">
          {prevCard && (
            <a
              href={`/${driver.slug}/p${pIdx}/c${prevCard.index}/`}
              className="flex-1 flex items-center gap-2 px-5 py-3 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>←</span>
              <span className="truncate">{prevCard.actionTitle}</span>
            </a>
          )}
          {nextCard && (
            <a
              href={`/${driver.slug}/p${pIdx}/c${nextCard.index}/`}
              className={`flex-1 flex items-center justify-end gap-2 px-5 py-3 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors${prevCard ? " border-l border-gray-100" : ""}`}
            >
              <span className="truncate">{nextCard.actionTitle}</span>
              <span>→</span>
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
