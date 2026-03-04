import { notFound } from "next/navigation";
import { DRIVERS, getDriverBySlug } from "@/lib/drivers";
import { getProblems, getCards } from "@/lib/data";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SelectableCard } from "@/components/session/SelectableCard";
import { CustomCardAdder } from "@/components/session/CustomCardAdder";

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
          <SelectableCard key={card.index} card={card} driver={driver} problemText={problem.thaiText} />
        ))}
        <CustomCardAdder
          driverSlug={driver.slug}
          problemIndex={pIdx}
          problemText={problem.thaiText}
          driver={driver}
        />
      </div>
    </main>
  );
}
