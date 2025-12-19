import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const csvPath = path.join(process.cwd(), "prisma", "seed", "sports-articles.csv");

  const csv = fs.readFileSync(csvPath, "utf8");

  const rows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as Array<{
    id: string;
    title: string;
    content: string;
    createdAt: string;
    imageUrl?: string;
  }>;

  const data = rows.map((row, i) => {
    if (!row.title || !row.content) {
      throw new Error(`Row ${i + 2}: title/content missing`);
    }

    return {
      title: row.title.trim(),
      content: row.content.trim(),
      createdAt: new Date(row.createdAt), // YYYY-MM-DD format
      imageUrl: row.imageUrl?.trim() || undefined
    };
  });

  await prisma.sportsArticle.deleteMany();

  const res = await prisma.sportsArticle.createMany({
    data
  });

  console.log(`✅ Seeded ${res.count} articles`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
