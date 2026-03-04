import { notFound } from "next/navigation";
import { DRIVERS, getDriverBySlug } from "@/lib/drivers";
import { getProblems, getCards } from "@/lib/data";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CardTile } from "@/components/cards/CardTile";

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
      ? `${problem.thaiText.slice(0, 40)}… | การ์ดทีม`
      : "การ์ดทีม",
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
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "หน้าแรก", href: "/" },
          { label: driver.thaiName, href: `/${driver.slug}/` },
          { label: `ปัญหาที่ ${pIdx + 1}`, href: `/${driver.slug}/p${pIdx}/` },
        ]}
      />
      <div className={`mt-5 mb-7 p-5 rounded-xl border-l-4 ${driver.borderClass} bg-white shadow-sm`}>
        <div className="flex items-center gap-2 mb-2">
          <span>{driver.icon}</span>
          <span className={`text-xs font-medium ${driver.textClass}`}>{driver.thaiName}</span>
        </div>
        <h1 className="text-lg font-bold text-gray-900 leading-snug">{problem.thaiText}</h1>
        <p className="text-sm text-gray-500 mt-1">{cards.length} วิธีแก้ไข</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <CardTile key={card.index} driver={driver} card={card} />
        ))}
      </div>
    </main>
  );
}
