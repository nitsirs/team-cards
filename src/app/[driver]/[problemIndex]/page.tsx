import { notFound } from "next/navigation";
import Link from "next/link";
import { DRIVERS, getDriverBySlug } from "@/lib/drivers";
import { getProblems, getCards } from "@/lib/data";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export async function generateStaticParams() {
  const params: { driver: string; problemIndex: string }[] = [];
  for (const driver of DRIVERS) {
    const problems = getProblems(driver.slug);
    for (const problem of problems) {
      params.push({ driver: driver.slug, problemIndex: `p${problem.index}` });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ driver: string; problemIndex: string }>;
}) {
  const { driver: slug, problemIndex } = await params;
  const driver = getDriverBySlug(slug);
  const pIdx = parseInt(problemIndex.replace("p", ""));
  const problems = driver ? getProblems(driver.slug) : [];
  const problem = problems[pIdx];
  return {
    title: problem
      ? `${problem.thaiText.slice(0, 40)}… | คู่มือแก้ปัญหาทีม`
      : "คู่มือแก้ปัญหาทีม",
  };
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ driver: string; problemIndex: string }>;
}) {
  const { driver: slug, problemIndex } = await params;
  const driver = getDriverBySlug(slug);
  if (!driver) notFound();

  const pIdx = parseInt(problemIndex.replace("p", ""));
  if (isNaN(pIdx)) notFound();

  const problems = getProblems(driver.slug);
  const problem = problems[pIdx];
  if (!problem) notFound();

  const cards = getCards(driver.slug, pIdx);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "หน้าแรก", href: "/" },
          { label: driver.thaiName, href: `/${driver.slug}/` },
          { label: `ปัญหาที่ ${pIdx + 1}`, href: `/${driver.slug}/p${pIdx}/` },
        ]}
      />
      <div className={`mt-5 mb-6 pl-4 border-l-4 ${driver.borderClass}`}>
        <div className="flex items-center gap-2 mb-1">
          <span>{driver.icon}</span>
          <span className={`text-xs font-medium ${driver.textClass}`}>{driver.thaiName}</span>
        </div>
        <h1 className="text-lg font-bold text-gray-900 leading-snug">{problem.thaiText}</h1>
        <p className="text-sm text-gray-400 mt-1">{cards.length} วิธีแก้</p>
      </div>

      <div className="flex flex-col">
        {cards.map((card) => (
          <details key={card.index} className="group border-b border-gray-50 last:border-0">
            <summary className="flex items-center gap-2 py-2 cursor-pointer list-none min-w-0">
              <span className="text-gray-300 text-xs flex-shrink-0 transition-transform group-open:rotate-90">▶</span>
              <span className="text-sm font-semibold text-gray-800 flex-shrink-0">{card.actionTitle}</span>
              <span className="text-xs text-gray-400 truncate flex-1 group-open:hidden">{card.detailedAction}</span>
              {card.notes && <span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded ${driver.bgLightClass} ${driver.textClass}`}>🔧 {card.notes}</span>}
            </summary>
            <div className="ml-4 pb-3">
              <p className="text-xs text-gray-500 leading-relaxed">{card.detailedAction}</p>
              {card.notes && (
                <p className={`mt-1.5 text-xs font-medium px-2 py-1 rounded-md inline-block ${driver.bgLightClass} ${driver.textClass}`}>
                  🔧 {card.notes}
                </p>
              )}
            </div>
          </details>
        ))}
      </div>
    </main>
  );
}
