import { DRIVERS } from "@/lib/drivers";
import { getDriverStats } from "@/lib/data";
import { DriverCard } from "@/components/home/DriverCard";

export default async function HomePage() {
  const stats = getDriverStats();
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">การ์ดทีม</h1>
        <p className="text-gray-500">เลือกหมวดหมู่ที่ต้องการแก้ปัญหา</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
