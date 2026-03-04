import { notFound } from "next/navigation";
import { DRIVERS, getDriverBySlug } from "@/lib/drivers";
import { getProblems } from "@/lib/data";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProblemItem } from "@/components/problems/ProblemItem";

export async function generateStaticParams() {
  return DRIVERS.map((d) => ({ driver: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ driver: string }> }) {
  const { driver: slug } = await params;
  const driver = getDriverBySlug(slug);
  return { title: driver ? `${driver.thaiName} | การ์ดทีม` : "การ์ดทีม" };
}

export default async function DriverPage({ params }: { params: Promise<{ driver: string }> }) {
  const { driver: slug } = await params;
  const driver = getDriverBySlug(slug);
  if (!driver) notFound();
  const problems = getProblems(driver.slug);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "หน้าแรก", href: "/" },
          { label: driver.thaiName, href: `/${driver.slug}/` },
        ]}
      />
      <div className="flex items-center gap-3 mt-5 mb-7">
        <span className="text-4xl">{driver.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{driver.thaiName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{problems.length} ปัญหา</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {problems.map((problem) => (
          <ProblemItem key={problem.index} driver={driver} problem={problem} />
        ))}
      </div>
    </main>
  );
}
