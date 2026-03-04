import { DRIVERS } from "@/lib/drivers";
import { getDriverStats } from "@/lib/data";
import { DriverCard } from "@/components/home/DriverCard";

export default async function HomePage() {
  const stats = getDriverStats();
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">คู่มือแก้ปัญหาทีม</h1>
        <p className="text-sm text-gray-500">เลือกหมวดหมู่ที่ต้องการแก้ปัญหา</p>
      </div>
      <div className="flex flex-col gap-2">
        {DRIVERS.map((driver) => (
          <DriverCard
            key={driver.slug}
            driver={driver}
            problemCount={stats[driver.slug]?.problemCount ?? 0}
            cardCount={stats[driver.slug]?.cardCount ?? 0}
          />
        ))}
      </div>
    </main>
  );
}
