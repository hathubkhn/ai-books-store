import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedBundles() {
  console.log("🌱 Seeding book bundles...");

  // Get tracks
  const mlTrack = await prisma.learningTrack.findUnique({
    where: { slug: "machine-learning" },
  });

  const cvTrack = await prisma.learningTrack.findUnique({
    where: { slug: "computer-vision" },
  });

  const dlTrack = await prisma.learningTrack.findUnique({
    where: { slug: "deep-learning" },
  });

  if (!mlTrack || !cvTrack || !dlTrack) {
    console.error("Tracks not found. Run seed-roadmap.ts first.");
    return;
  }

  // Get some books
  const books = await prisma.book.findMany({
    where: { isActive: true },
    take: 12,
  });

  if (books.length < 3) {
    console.error("Not enough books. Run seed.ts first.");
    return;
  }

  // Bundle 1: ML Starter Pack
  const mlStarterBundle = await prisma.bookBundle.upsert({
    where: { slug: "ml-starter-pack" },
    update: {},
    create: {
      slug: "ml-starter-pack",
      trackId: mlTrack.id,
      title: "Machine Learning Starter Pack",
      titleEn: "Machine Learning Starter Pack",
      description:
        "Bộ sách cơ bản cho người mới bắt đầu học Machine Learning. Bao gồm Python, Data Processing và ML Fundamentals.",
      descriptionEn:
        "Essential books for ML beginners. Includes Python, Data Processing and ML Fundamentals.",
      level: "STARTER",
      discountType: "PERCENTAGE",
      discountValue: 15,
      isActive: true,
      displayOrder: 1,
    },
  });

  // Add books to ML starter bundle
  const mlStarterBooks = books.slice(0, 3);
  for (let i = 0; i < mlStarterBooks.length; i++) {
    await prisma.bookBundleItem.upsert({
      where: {
        bundleId_bookId: {
          bundleId: mlStarterBundle.id,
          bookId: mlStarterBooks[i].id,
        },
      },
      update: {},
      create: {
        bundleId: mlStarterBundle.id,
        bookId: mlStarterBooks[i].id,
        isRequired: true,
        displayOrder: i + 1,
      },
    });
  }

  console.log("✅ ML Starter Pack created");

  // Bundle 2: CV Complete Path
  const cvCompleteBundle = await prisma.bookBundle.upsert({
    where: { slug: "cv-complete-path" },
    update: {},
    create: {
      slug: "cv-complete-path",
      trackId: cvTrack.id,
      title: "Computer Vision Complete Path",
      titleEn: "Computer Vision Complete Path",
      description:
        "Lộ trình hoàn chỉnh học Computer Vision từ cơ bản đến nâng cao. Bao gồm OpenCV, Deep Learning và Object Detection.",
      descriptionEn:
        "Complete CV learning path from basics to advanced. Includes OpenCV, Deep Learning and Object Detection.",
      level: "PRACTITIONER",
      discountType: "PERCENTAGE",
      discountValue: 20,
      isActive: true,
      displayOrder: 1,
    },
  });

  const cvCompleteBooks = books.slice(3, 7);
  for (let i = 0; i < cvCompleteBooks.length; i++) {
    await prisma.bookBundleItem.upsert({
      where: {
        bundleId_bookId: {
          bundleId: cvCompleteBundle.id,
          bookId: cvCompleteBooks[i].id,
        },
      },
      update: {},
      create: {
        bundleId: cvCompleteBundle.id,
        bookId: cvCompleteBooks[i].id,
        isRequired: i < 3, // First 3 are required
        displayOrder: i + 1,
      },
    });
  }

  console.log("✅ CV Complete Path created");

  // Bundle 3: DL Advanced Pack
  const dlAdvancedBundle = await prisma.bookBundle.upsert({
    where: { slug: "dl-advanced-pack" },
    update: {},
    create: {
      slug: "dl-advanced-pack",
      trackId: dlTrack.id,
      title: "Deep Learning Advanced Pack",
      titleEn: "Deep Learning Advanced Pack",
      description:
        "Bộ sách nâng cao cho người đã có nền tảng Deep Learning. Transformer, CNN, RNN và các kiến trúc hiện đại.",
      descriptionEn:
        "Advanced DL books for experienced learners. Transformer, CNN, RNN and modern architectures.",
      level: "ADVANCED",
      discountType: "PERCENTAGE",
      discountValue: 18,
      isActive: true,
      displayOrder: 1,
    },
  });

  const dlAdvancedBooks = books.slice(7, 10);
  for (let i = 0; i < dlAdvancedBooks.length; i++) {
    await prisma.bookBundleItem.upsert({
      where: {
        bundleId_bookId: {
          bundleId: dlAdvancedBundle.id,
          bookId: dlAdvancedBooks[i].id,
        },
      },
      update: {},
      create: {
        bundleId: dlAdvancedBundle.id,
        bookId: dlAdvancedBooks[i].id,
        isRequired: true,
        displayOrder: i + 1,
      },
    });
  }

  console.log("✅ DL Advanced Pack created");

  // Bundle 4: AI Foundation (generic, not track-specific)
  const aiFoundationBundle = await prisma.bookBundle.upsert({
    where: { slug: "ai-foundation" },
    update: {},
    create: {
      slug: "ai-foundation",
      trackId: null, // Generic bundle
      title: "AI Foundation Bundle",
      titleEn: "AI Foundation Bundle",
      description:
        "Nền tảng AI cho mọi người. Phù hợp cho học sinh và người mới bắt đầu tìm hiểu về AI.",
      descriptionEn:
        "AI Foundation for everyone. Perfect for students and AI beginners.",
      level: "STARTER",
      discountType: "PERCENTAGE",
      discountValue: 12,
      isActive: true,
      displayOrder: 0,
    },
  });

  const aiFoundationBooks = books.slice(0, 2);
  for (let i = 0; i < aiFoundationBooks.length; i++) {
    await prisma.bookBundleItem.upsert({
      where: {
        bundleId_bookId: {
          bundleId: aiFoundationBundle.id,
          bookId: aiFoundationBooks[i].id,
        },
      },
      update: {},
      create: {
        bundleId: aiFoundationBundle.id,
        bookId: aiFoundationBooks[i].id,
        isRequired: true,
        displayOrder: i + 1,
      },
    });
  }

  console.log("✅ AI Foundation Bundle created");

  console.log("🎉 Bundle seeding completed! Created 4 bundles.");
}

seedBundles()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
