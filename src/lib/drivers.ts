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
      "ทีมมีคนที่เหมาะสมไหม? มีความรู้ ทักษะ และคุณสมบัติครบในแบบที่ทีมต้องการ? มีช่องว่างด้านทักษะ ปัญหาบุคลิกภาพ หรือขาดคนที่ทำงานเป็นทีมได้ดีไหม?",
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
      "สมาชิกทีมมีทัศนคติที่ดีต่อทีมไหม? ไว้วางใจกัน กล้าพูดในสิ่งที่คิด เชื่อว่าทีมจะประสบความสำเร็จ และรู้สึกว่างานที่ทำมีความหมายไหม?",
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
      "ทีมทำงานร่วมกันได้มีประสิทธิภาพสม่ำเสมอไหม? ช่วยกันจับตาสถานการณ์ หนุนช่วยกันทันท่วงที ปรับตัวได้ดี และรับมือกับความขัดแย้งและอารมณ์อย่างสร้างสรรค์ไหม?",
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
      "ทีมแบ่งปันข้อมูลกันได้ดีทั้งภายในและภายนอกทีมไหม? สื่อสารทันเวลา ยืนยันความเข้าใจตรงกัน และส่งสารที่สอดคล้องกันไปยังคนนอกทีมไหม?",
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
      "สมาชิกทีมเข้าใจทิศทาง บทบาท และลำดับความสำคัญตรงกันไหม? ตอบได้ใกล้เคียงกันไหมว่า: เราจะไปทางไหน? ตอนนี้อะไรสำคัญที่สุด? ใครทำอะไร? ใครรู้เรื่องนี้ดีที่สุด? และตอนนี้สถานการณ์เป็นอย่างไร?",
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
      "ผู้นำและสมาชิกทีมแสดงพฤติกรรมที่ช่วยให้ทีมประสบความสำเร็จไหม? ดูแลให้กันและกันรับผิดชอบ สร้างความชัดเจน ขจัดอุปสรรค บริหารอารมณ์ทีม ดึงทุกคนมีส่วนร่วม และส่งเสริมการเรียนรู้ไหม?",
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
      "ทีมมีสภาพแวดล้อมที่พร้อมสำหรับการทำงานร่วมกันไหม? มีทรัพยากร เวลา และการสนับสนุนเพียงพอ? นโยบายและวัฒนธรรมองค์กรส่งเสริมการทำงานเป็นทีมไหม?",
  },
];

export function getDriverBySlug(slug: string): DriverMeta | undefined {
  return DRIVERS.find((d) => d.slug === slug);
}
