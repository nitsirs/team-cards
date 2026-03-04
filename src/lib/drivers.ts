export interface DriverMeta {
  slug: string;
  thaiName: string;
  csvLabel: string;
  colorClass: string;
  textClass: string;
  borderClass: string;
  bgLightClass: string;
  icon: string;
}

export const DRIVERS: DriverMeta[] = [
  {
    slug: "capability",
    thaiName: "ความสามารถ",
    csvLabel: "ความสามารถ (Capability)",
    colorClass: "bg-blue-500",
    textClass: "text-blue-700",
    borderClass: "border-blue-400",
    bgLightClass: "bg-blue-100",
    icon: "🎯",
  },
  {
    slug: "cooperation",
    thaiName: "การให้ความร่วมมือ",
    csvLabel: "การให้ความร่วมมือ (Cooperation)",
    colorClass: "bg-green-500",
    textClass: "text-green-700",
    borderClass: "border-green-400",
    bgLightClass: "bg-green-100",
    icon: "🤝",
  },
  {
    slug: "coordination",
    thaiName: "การประสานงาน",
    csvLabel: "การประสานงาน (Coordination)",
    colorClass: "bg-orange-500",
    textClass: "text-orange-700",
    borderClass: "border-orange-400",
    bgLightClass: "bg-orange-100",
    icon: "🔄",
  },
  {
    slug: "communication",
    thaiName: "การสื่อสาร",
    csvLabel: "การสื่อสาร (Communication)",
    colorClass: "bg-yellow-500",
    textClass: "text-yellow-700",
    borderClass: "border-yellow-400",
    bgLightClass: "bg-yellow-100",
    icon: "💬",
  },
  {
    slug: "cognitions",
    thaiName: "กระบวนการคิดของทีม",
    csvLabel: "กระบวนการคิดของทีม (Cognitions)",
    colorClass: "bg-purple-500",
    textClass: "text-purple-700",
    borderClass: "border-purple-400",
    bgLightClass: "bg-purple-100",
    icon: "🧠",
  },
  {
    slug: "coaching",
    thaiName: "การโค้ชชิ่ง",
    csvLabel: "การโค้ชชิ่ง (Coaching)",
    colorClass: "bg-pink-500",
    textClass: "text-pink-700",
    borderClass: "border-pink-400",
    bgLightClass: "bg-pink-100",
    icon: "📋",
  },
  {
    slug: "conditions",
    thaiName: "สภาพแวดล้อม",
    csvLabel: "สภาพแวดล้อม (Conditions)",
    colorClass: "bg-teal-500",
    textClass: "text-teal-700",
    borderClass: "border-teal-400",
    bgLightClass: "bg-teal-100",
    icon: "🌱",
  },
];

export function getDriverBySlug(slug: string): DriverMeta | undefined {
  return DRIVERS.find((d) => d.slug === slug);
}
