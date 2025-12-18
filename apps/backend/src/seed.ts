import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.sportsArticle.deleteMany();

  await prisma.sportsArticle.createMany({
    data: [
      {
        title: "Champions League: Real Madrid secure victory",
        content: "Real Madrid secured a dramatic win in the Champions League...",
        createdAt: new Date("2024-05-01"),
        imageUrl: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a"
      },
      {
        title: "NBA Playoffs: Lakers advance",
        content: "The Los Angeles Lakers advanced after a thrilling series...",
        createdAt: new Date("2024-05-02"),
        imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b"
      }
    ]
  });

  console.log("Seeded articles");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
