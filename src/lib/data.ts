import "server-only";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { DRIVERS } from "./drivers";
import type { Problem, Card, AllData } from "./types";

const DRIVER_MAP: Record<string, string> = {
  "ความสามารถ (Capability)": "capability",
  "การให้ความร่วมมือ (Cooperation)": "cooperation",
  "การประสานงาน (Coordination)": "coordination",
  "การสื่อสาร (Communication)": "communication",
  "กระบวนการคิดของทีม (Cognitions)": "cognitions",
  "การโค้ชชิ่ง (Coaching)": "coaching",
  "สภาพแวดล้อม (Conditions)": "conditions",
};

interface CsvRow {
  "หมวดหมู่ (Driver)": string;
  "ปัญหาที่เจอ (Potential Concern)": string;
  "ชื่อวิธีแก้ (Action Title)": string;
  "วิธีทำแบบละเอียด (Detailed Action)": string;
  "โน้ต/เครื่องมือที่ต้องเตรียม (อ้างอิงจากหนังสือเท่านั้น)": string;
}

interface DriverData {
  problems: {
    thaiText: string;
    cards: { actionTitle: string; detailedAction: string; notes: string | null }[];
  }[];
}

let _toolsMap: Map<string, string> | null = null;

function getToolsMap(): Map<string, string> {
  if (_toolsMap) return _toolsMap;
  const csvPath = path.join(process.cwd(), "tool.csv");
  const csvText = fs.readFileSync(csvPath, "utf-8");
  const { data } = Papa.parse<{ Tools: string; Explaination: string }>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  _toolsMap = new Map(
    data.map((row) => [row.Tools?.trim().toLowerCase(), row.Explaination?.trim() ?? ""])
  );
  return _toolsMap;
}

function findToolExplanation(notes: string | null): string | null {
  if (!notes) return null;
  const map = getToolsMap();
  const notesLower = notes.toLowerCase();
  // exact match
  if (map.has(notesLower)) return map.get(notesLower) || null;
  // partial: tool key contains notes, or notes contains tool key
  for (const [key, explanation] of map) {
    if (key.includes(notesLower) || notesLower.includes(key)) {
      return explanation || null;
    }
  }
  return null;
}

let _data: Record<string, DriverData> | null = null;

function getData(): Record<string, DriverData> {
  if (_data) return _data;
  const csvPath = path.join(process.cwd(), "card.csv");
  const csvText = fs.readFileSync(csvPath, "utf-8");
  const { data } = Papa.parse<CsvRow>(csvText, { header: true, skipEmptyLines: true });

  const result: Record<string, DriverData> = {};
  for (const row of data) {
    const driverLabel = row["หมวดหมู่ (Driver)"]?.trim();
    const problemText = row["ปัญหาที่เจอ (Potential Concern)"]?.trim();
    const actionTitle = row["ชื่อวิธีแก้ (Action Title)"]?.trim();
    const detailedAction = row["วิธีทำแบบละเอียด (Detailed Action)"]?.trim();
    const notes =
      row["โน้ต/เครื่องมือที่ต้องเตรียม (อ้างอิงจากหนังสือเท่านั้น)"]?.trim() || null;

    if (!driverLabel || !problemText || !actionTitle) continue;
    const slug = DRIVER_MAP[driverLabel];
    if (!slug) continue;

    if (!result[slug]) result[slug] = { problems: [] };
    let problem = result[slug].problems.find((p) => p.thaiText === problemText);
    if (!problem) {
      problem = { thaiText: problemText, cards: [] };
      result[slug].problems.push(problem);
    }
    problem.cards.push({ actionTitle, detailedAction, notes });
  }

  _data = result;
  return _data;
}

export function getDriverStats(): Record<string, { problemCount: number; cardCount: number }> {
  const data = getData();
  return Object.fromEntries(
    DRIVERS.map((driver) => {
      const d = data[driver.slug];
      const problemCount = d?.problems.length ?? 0;
      const cardCount = d?.problems.reduce((s, p) => s + p.cards.length, 0) ?? 0;
      return [driver.slug, { problemCount, cardCount }];
    })
  );
}

export function getProblems(driverSlug: string): Problem[] {
  const problems = getData()[driverSlug]?.problems ?? [];
  return problems.map((p, index) => ({
    index,
    thaiText: p.thaiText,
    cardCount: p.cards.length,
  }));
}

export function getCards(driverSlug: string, problemIndex: number): Card[] {
  const problem = getData()[driverSlug]?.problems[problemIndex];
  if (!problem) return [];
  return problem.cards.map((c, index) => ({
    index,
    driverSlug,
    problemIndex,
    actionTitle: c.actionTitle,
    detailedAction: c.detailedAction,
    notes: c.notes,
    toolExplanation: findToolExplanation(c.notes),
  }));
}

export function getCard(driverSlug: string, problemIndex: number, cardIndex: number): Card | null {
  return getCards(driverSlug, problemIndex)[cardIndex] ?? null;
}

export function getAllData(): AllData {
  return getData() as AllData;
}
