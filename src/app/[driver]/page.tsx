import { notFound } from "next/navigation";
import { DRIVERS, getDriverBySlug } from "@/lib/drivers";
import { getProblems, getCards } from "@/lib/data";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProblemItem } from "@/components/drivers/ProblemItem";

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
            <ProblemItem
              key={problem.index}
              problem={problem}
              cards={cards}
              driver={driver}
            />
          );
        })}
      </div>
    </main>
  );
}
