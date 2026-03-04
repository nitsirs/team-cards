export interface DriverMeta {
  slug: string;
  englishName: string;
  thaiName: string;
  csvLabel: string;
  colorClass: string;
  textClass: string;
  borderClass: string;
  bgLightClass: string;
  icon: string;
  diagnostic: string;
}

export const DRIVERS: DriverMeta[] = [
  {
    slug: "capability",
    englishName: "Capability",
    thaiName: "ความสามารถ",
    csvLabel: "ความสามารถ (Capability)",
    colorClass: "bg-blue-500",
    textClass: "text-blue-700",
    borderClass: "border-blue-400",
    bgLightClass: "bg-blue-100",
    icon: "🎯",
    diagnostic:
      "ทีมมีคนเก่งเพียงพอไหม? มีช่องว่างด้านทักษะหรือความต้องการพัฒนา ปัญหาบุคลิกภาพสำคัญ และมีสมาชิกที่เป็น Team player เพียงพอไหม?",
  },
  {
    slug: "cooperation",
    englishName: "Cooperation",
    thaiName: "การให้ความร่วมมือ",
    csvLabel: "การให้ความร่วมมือ (Cooperation)",
    colorClass: "bg-green-500",
    textClass: "text-green-700",
    borderClass: "border-green-400",
    bgLightClass: "bg-green-100",
    icon: "🤝",
    diagnostic:
      "เราไว้วางใจกัน รู้สึกปลอดภัยที่จะพูดออกมา [ความปลอดภัยทางจิตใจ] เชื่อว่าทีมจะ \"ชนะ\" [ความเชื่อมั่นในทีม] และเชื่อว่างานที่เราทำนั้นมีคุณค่าไหม?",
  },
  {
    slug: "coordination",
    englishName: "Coordination",
    thaiName: "การประสานงาน",
    csvLabel: "การประสานงาน (Coordination)",
    colorClass: "bg-orange-500",
    textClass: "text-orange-700",
    borderClass: "border-orange-400",
    bgLightClass: "bg-orange-100",
    icon: "🔄",
    diagnostic:
      "เราติดตามกันและกันและสถานการณ์ได้ดี ให้การสนับสนุนช่วยเหลือ ปรับตัวตามสถานการณ์ และจัดการความขัดแย้งกับอารมณ์อย่างสร้างสรรค์ไหม?",
  },
  {
    slug: "communication",
    englishName: "Communication",
    thaiName: "การสื่อสาร",
    csvLabel: "การสื่อสาร (Communication)",
    colorClass: "bg-yellow-500",
    textClass: "text-yellow-700",
    borderClass: "border-yellow-400",
    bgLightClass: "bg-yellow-100",
    icon: "💬",
    diagnostic:
      "เราแบ่งปันข้อมูลที่จำเป็น สื่อสารได้ทันเวลา ยืนยันความเข้าใจ แจ้งให้ผู้อื่นรับทราบ และส่งข้อความที่สอดคล้องกันไปยังคนนอกทีมไหม?",
  },
  {
    slug: "cognitions",
    englishName: "Cognitions",
    thaiName: "กระบวนการคิดของทีม",
    csvLabel: "กระบวนการคิดของทีม (Cognitions)",
    colorClass: "bg-purple-500",
    textClass: "text-purple-700",
    borderClass: "border-purple-400",
    bgLightClass: "bg-purple-100",
    icon: "🧠",
    diagnostic:
      "เราเข้าใจตรงกันไหม? ตอบคำถามเหล่านี้ได้ใกล้เคียงกันไหม: เรากำลังมุ่งหน้าไปไหน? ลำดับความสำคัญตอนนี้คืออะไร? ใครควรทำอะไร? ใครรู้เรื่องนี้มากที่สุด? และตอนนี้เกิดอะไรขึ้น?",
  },
  {
    slug: "coaching",
    englishName: "Coaching",
    thaiName: "การโค้ชชิ่ง",
    csvLabel: "การโค้ชชิ่ง (Coaching)",
    colorClass: "bg-pink-500",
    textClass: "text-pink-700",
    borderClass: "border-pink-400",
    bgLightClass: "bg-pink-100",
    icon: "📋",
    diagnostic:
      "เราดำเนินการให้กันและกันรับผิดชอบ สร้างความชัดเจน ขจัดอุปสรรค จัดการอารมณ์ของทีม ส่งเสริมการมีส่วนร่วม และส่งเสริมการเรียนรู้ไหม?",
  },
  {
    slug: "conditions",
    englishName: "Conditions",
    thaiName: "สภาพแวดล้อม",
    csvLabel: "สภาพแวดล้อม (Conditions)",
    colorClass: "bg-teal-500",
    textClass: "text-teal-700",
    borderClass: "border-teal-400",
    bgLightClass: "bg-teal-100",
    icon: "🌱",
    diagnostic:
      "เรามีทรัพยากร เวลา และการสนับสนุนที่เพียงพอไหม? นโยบาย แนวปฏิบัติ และวัฒนธรรมองค์กรส่งเสริมการทำงานเป็นทีมไหม?",
  },
];

export function getDriverBySlug(slug: string): DriverMeta | undefined {
  return DRIVERS.find((d) => d.slug === slug);
}
