import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating categories...");

  // Update categories with new names
  await prisma.category.update({
    where: { slug: "ai-first-steps" },
    data: {
      name: "AI for Kids",
      description: "Artificial Intelligence for primary school students through fun stories and activities.",
    },
  });

  await prisma.category.update({
    where: { slug: "exploring-ai" },
    data: {
      name: "AI for Middle School",
      description: "Explore how computers learn, recognize images, understand language, and solve problems.",
    },
  });

  await prisma.category.update({
    where: { slug: "advanced-ai-foundations" },
    data: {
      name: "AI for High School",
      description: "Mathematics, programming, and Machine Learning foundations for high school students.",
    },
  });

  await prisma.category.update({
    where: { slug: "ai-machine-learning" },
    data: {
      name: "Chuyên Ngành AI",
      description: "Advanced AI, Machine Learning, and Deep Learning for university students and professionals.",
    },
  });

  await prisma.category.update({
    where: { slug: "algorithms-programming" },
    data: {
      name: "Data & Algorithms",
      description: "Algorithmic thinking, data structures, and programming skills for computer science.",
    },
  });

  console.log("✓ Categories updated successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Update failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
