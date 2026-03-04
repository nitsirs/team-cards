import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const Papa = require("papaparse");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const csvText = fs.readFileSync(path.join(root, "card.csv"), "utf-8");
const { data } = Papa.parse(csvText, { header: true, skipEmptyLines: true });

const DRIVER_MAP = {
  "ความสามารถ (Capability)": "capability",
  "การให้ความร่วมมือ (Cooperation)": "cooperation",
  "การประสานงาน (Coordination)": "coordination",
  "การสื่อสาร (Communication)": "communication",
  "กระบวนการคิดของทีม (Cognitions)": "cognitions",
  "การโค้ชชิ่ง (Coaching)": "coaching",
  "สภาพแวดล้อม (Conditions)": "conditions",
};

const drivers = {};

for (const row of data) {
  const driverLabel = row["หมวดหมู่ (Driver)"]?.trim();
  const problemText = row["ปัญหาที่เจอ (Potential Concern)"]?.trim();
  const actionTitle = row["ชื่อวิธีแก้ (Action Title)"]?.trim();
  const detailedAction = row["วิธีทำแบบละเอียด (Detailed Action)"]?.trim();
  const notes = row["โน้ต/เครื่องมือที่ต้องเตรียม (อ้างอิงจากหนังสือเท่านั้น)"]?.trim() || null;

  if (!driverLabel || !problemText || !actionTitle) continue;

  const slug = DRIVER_MAP[driverLabel];
  if (!slug) continue;

  if (!drivers[slug]) drivers[slug] = { problems: [] };

  let problem = drivers[slug].problems.find((p) => p.thaiText === problemText);
  if (!problem) {
    problem = { thaiText: problemText, cards: [] };
    drivers[slug].problems.push(problem);
  }

  problem.cards.push({ actionTitle, detailedAction, notes });
}

fs.writeFileSync(path.join(root, "card.json"), JSON.stringify(drivers, null, 2), "utf-8");
console.log("Done. card.json written.");
for (const [slug, d] of Object.entries(drivers)) {
  const cardCount = d.problems.reduce((s, p) => s + p.cards.length, 0);
  console.log(`  ${slug}: ${d.problems.length} problems, ${cardCount} cards`);
}
