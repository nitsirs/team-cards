import "server-only";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { DRIVERS } from "./drivers";
import type { Problem, Card } from "./types";

interface RawRow {
  "หมวดหมู่ (Driver)": string;
  "ปัญหาที่เจอ (Potential Concern)": string;
  "ชื่อวิธีแก้ (Action Title)": string;
  "วิธีทำแบบละเอียด (Detailed Action)": string;
  "โน้ต/เครื่องมือที่ต้องเตรียม (อ้างอิงจากหนังสือเท่านั้น)": string;
}

let _parsed: RawRow[] | null = null;

function getAllRows(): RawRow[] {
  if (_parsed) return _parsed;
  const csvPath = path.join(process.cwd(), "card.csv");
  const csvText = fs.readFileSync(csvPath, "utf-8");
  const result = Papa.parse<RawRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  _parsed = result.data.filter((r) => r["หมวดหมู่ (Driver)"]?.trim());
  return _parsed;
}

export function getDriverStats(): Record<string, { problemCount: number; cardCount: number }> {
  const rows = getAllRows();
  return Object.fromEntries(
    DRIVERS.map((driver) => {
      const driverRows = rows.filter((r) => r["หมวดหมู่ (Driver)"] === driver.csvLabel);
      const problemSet = new Set(driverRows.map((r) => r["ปัญหาที่เจอ (Potential Concern)"]));
      return [driver.slug, { problemCount: problemSet.size, cardCount: driverRows.length }];
    })
  );
}

export function getProblems(driverSlug: string): Problem[] {
  const driver = DRIVERS.find((d) => d.slug === driverSlug);
  if (!driver) return [];
  const rows = getAllRows().filter((r) => r["หมวดหมู่ (Driver)"] === driver.csvLabel);
  const seen = new Map<string, number>();
  rows.forEach((r) => {
    const p = r["ปัญหาที่เจอ (Potential Concern)"];
    if (!seen.has(p)) seen.set(p, seen.size);
  });
  return Array.from(seen.entries()).map(([text, index]) => ({
    index,
    thaiText: text,
    cardCount: rows.filter((r) => r["ปัญหาที่เจอ (Potential Concern)"] === text).length,
  }));
}

export function getCards(driverSlug: string, problemIndex: number): Card[] {
  const driver = DRIVERS.find((d) => d.slug === driverSlug);
  if (!driver) return [];
  const rows = getAllRows().filter((r) => r["หมวดหมู่ (Driver)"] === driver.csvLabel);
  const problems = getProblems(driverSlug);
  const problem = problems[problemIndex];
  if (!problem) return [];
  return rows
    .filter((r) => r["ปัญหาที่เจอ (Potential Concern)"] === problem.thaiText)
    .map((r, idx) => ({
      index: idx,
      driverSlug,
      problemIndex,
      actionTitle: r["ชื่อวิธีแก้ (Action Title)"],
      detailedAction: r["วิธีทำแบบละเอียด (Detailed Action)"],
      notes: r["โน้ต/เครื่องมือที่ต้องเตรียม (อ้างอิงจากหนังสือเท่านั้น)"]?.trim() || null,
    }));
}

export function getCard(driverSlug: string, problemIndex: number, cardIndex: number): Card | null {
  const cards = getCards(driverSlug, problemIndex);
  return cards[cardIndex] ?? null;
}
