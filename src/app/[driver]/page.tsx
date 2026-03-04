import { notFound } from "next/navigation";
import Link from "next/link";
import { DRIVERS, getDriverBySlug } from "@/lib/drivers";
import { getProblems, getCards } from "@/lib/data";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export async function generateStaticParams() {
  return DRIVERS.map((d) => ({ driver: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ driver: string }> }) {
  const { driver: slug } = await params;
  const driver = getDriverBySlug(slug);
  return { title: driver ? `${driver.thaiName} | คู่มือแก้ปัญหาทีม` : "คู่มือแก้ปัญหาทีม" };
}

export default async function DriverPage({ params }: { params: Promise<{ driver: string }> }) {
  const { driver: slug } = await params;
  const driver = getDriverBySlug(slug);
  if (!driver) notFound();
  const problems = getProblems(driver.slug);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "หน้าแรก", href: "/" },
          { label: driver.thaiName, href: `/${driver.slug}/` },
        ]}
      />
      <div className="flex items-center gap-3 mt-5 mb-6">
        <span className="text-3xl">{driver.icon}</span>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{driver.englishName}</h1>
          <p className="text-xs text-gray-400">{driver.thaiName}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {problems.map((problem) => {
          const cards = getCards(driver.slug, problem.index);
          return (
            <details key={problem.index} className="group/problem">
              <summary className={`flex items-center gap-2 py-2 cursor-pointer list-none border-b ${driver.borderClass}`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${driver.colorClass}`} />
                <span className="text-sm font-semibold text-gray-700 leading-snug flex-1 group-hover/problem:text-gray-900 transition-colors">
                  {problem.thaiText}
                </span>
                <span className="text-xs text-gray-400">{cards.length} วิธีแก้</span>
                <span className="text-gray-400 text-xs transition-transform group-open/problem:rotate-90">▶</span>
              </summary>
              <div className="flex flex-col gap-1 pl-4 pt-1 pb-2">
                {cards.map((card) => (
                  <Link
                    key={card.index}
                    href={`/${driver.slug}/p${problem.index}/c${card.index}/`}
                    className="group/card block py-1"
                  >
                    <p className="text-sm text-gray-700 leading-snug group-hover/card:text-gray-900 transition-colors">{card.actionTitle}</p>
                    <p className="text-xs text-gray-400 leading-snug mt-0.5 line-clamp-1">{card.detailedAction}</p>
                  </Link>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </main>
  );
}
