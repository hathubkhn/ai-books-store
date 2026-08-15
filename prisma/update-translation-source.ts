import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateTranslationSources() {
  console.log("🌱 Updating books with translation sources...");

  // Update books in "specialization" and "high-school" categories
  // These are likely to be from Tsinghua University

  const updatedBooks = await prisma.book.updateMany({
    where: {
      OR: [
        { category: { slug: "specialization" } },
        { category: { slug: "high-school" } },
        { category: { slug: "data-and-algorithms" } },
      ],
    },
    data: {
      translationSource: "Đại học Thanh Hoa (Tsinghua University), Trung Quốc - Top 1 về Khoa học Dữ liệu",
    },
  });

  console.log(`✅ Updated ${updatedBooks.count} books with translation source`);

  // You can also update specific books individually
  // Example:
  // await prisma.book.update({
  //   where: { slug: "computer-vision-advanced" },
  //   data: {
  //     translationSource: "Đại học Thanh Hoa (Tsinghua University)",
  //     originalTitle: "Computer Vision: Algorithms and Applications",
  //   },
  // });
}

updateTranslationSources()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
