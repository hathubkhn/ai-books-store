import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedBookMappings() {
  console.log("🌱 Seeding book-to-stage mappings...");

  // Get tracks
  const mlTrack = await prisma.learningTrack.findUnique({
    where: { slug: "machine-learning" },
    include: { stages: true },
  });

  const cvTrack = await prisma.learningTrack.findUnique({
    where: { slug: "computer-vision" },
    include: { stages: true },
  });

  const dlTrack = await prisma.learningTrack.findUnique({
    where: { slug: "deep-learning" },
    include: { stages: true },
  });

  if (!mlTrack || !cvTrack || !dlTrack) {
    console.error("Tracks not found. Run seed-roadmap.ts first.");
    return;
  }

  // Get books (example with existing books from category slugs)
  const books = await prisma.book.findMany({
    where: { isActive: true },
    include: { category: true },
  });

  // Map books to stages based on category and title keywords
  const mappings = [];

  // Machine Learning mappings
  for (const book of books) {
    // Python foundation books
    if (
      book.category.slug === "ai-for-kids" ||
      book.title.toLowerCase().includes("python") ||
      book.title.toLowerCase().includes("cơ bản")
    ) {
      const pythonStage = mlTrack.stages.find((s) => s.slug === "python-foundation");
      if (pythonStage) {
        mappings.push({
          bookId: book.id,
          stageId: pythonStage.id,
          recommendationPriority: 10,
          recommendationReason:
            "Cuốn sách này giúp bạn nắm vững Python - ngôn ngữ chính cho Machine Learning. Bắt đầu từ cú pháp cơ bản đến lập trình hướng đối tượng.",
          isPrimary: true,
        });
      }
    }

    // ML fundamentals
    if (
      book.category.slug === "high-school" ||
      book.title.toLowerCase().includes("machine learning") ||
      book.title.toLowerCase().includes("học máy")
    ) {
      const mlStage = mlTrack.stages.find((s) => s.slug === "ml-fundamentals");
      if (mlStage) {
        mappings.push({
          bookId: book.id,
          stageId: mlStage.id,
          recommendationPriority: 10,
          recommendationReason:
            "Cuốn sách này giới thiệu các thuật toán ML cơ bản: Classification, Regression, và cách đánh giá model. Hands-on với scikit-learn.",
          isPrimary: true,
        });
      }
    }

    // Deep Learning intro
    if (
      book.category.slug === "specialization" ||
      book.title.toLowerCase().includes("deep learning") ||
      book.title.toLowerCase().includes("neural")
    ) {
      const dlStage = mlTrack.stages.find((s) => s.slug === "deep-learning-intro");
      if (dlStage) {
        mappings.push({
          bookId: book.id,
          stageId: dlStage.id,
          recommendationPriority: 10,
          recommendationReason:
            "Giới thiệu Neural Networks và Deep Learning. Học cách xây dựng và train models với PyTorch hoặc TensorFlow.",
          isPrimary: true,
        });
      }
    }
  }

  // Computer Vision mappings
  for (const book of books) {
    // Python & NumPy
    if (book.title.toLowerCase().includes("python") || book.category.slug === "ai-for-kids") {
      const pythonStage = cvTrack.stages.find((s) => s.slug === "python-numpy");
      if (pythonStage) {
        mappings.push({
          bookId: book.id,
          stageId: pythonStage.id,
          recommendationPriority: 8,
          recommendationReason:
            "Nền tảng Python và NumPy để xử lý mảng đa chiều - cần thiết cho Computer Vision.",
          isPrimary: true,
        });
      }
    }

    // CV-specific books
    if (book.title.toLowerCase().includes("computer vision") || book.title.toLowerCase().includes("thị giác")) {
      const cvStages = [
        cvTrack.stages.find((s) => s.slug === "deep-learning-pytorch"),
        cvTrack.stages.find((s) => s.slug === "cnn-classification"),
        cvTrack.stages.find((s) => s.slug === "object-detection"),
      ];

      cvStages.forEach((stage, index) => {
        if (stage) {
          mappings.push({
            bookId: book.id,
            stageId: stage.id,
            recommendationPriority: 10 - index,
            recommendationReason:
              index === 0
                ? "Cuốn sách về Computer Vision này đặc biệt phù hợp để học CNN và Image Classification. Có nhiều ví dụ thực hành."
                : "Tiếp tục chuyên sâu vào các kiến trúc và ứng dụng CV hiện đại.",
            isPrimary: index === 0,
          });
        }
      });
    }
  }

  // Deep Learning mappings
  for (const book of books) {
    if (
      book.title.toLowerCase().includes("deep learning") ||
      book.category.slug === "specialization"
    ) {
      const dlStages = [
        dlTrack.stages.find((s) => s.slug === "neural-networks"),
        dlTrack.stages.find((s) => s.slug === "pytorch-tensorflow"),
        dlTrack.stages.find((s) => s.slug === "cnn"),
      ];

      dlStages.forEach((stage, index) => {
        if (stage) {
          mappings.push({
            bookId: book.id,
            stageId: stage.id,
            recommendationPriority: 10 - index,
            recommendationReason:
              "Cuốn sách này cung cấp kiến thức chuyên sâu về Deep Learning với nhiều ví dụ thực hành.",
            isPrimary: index === 0,
          });
        }
      });
    }
  }

  // Create mappings
  let created = 0;
  for (const mapping of mappings) {
    try {
      await prisma.bookStageMapping.upsert({
        where: {
          bookId_stageId: {
            bookId: mapping.bookId,
            stageId: mapping.stageId,
          },
        },
        create: mapping,
        update: {},
      });
      created++;
    } catch (error) {
      console.error("Error creating mapping:", error);
    }
  }

  console.log(`✅ Created ${created} book-to-stage mappings`);
}

seedBookMappings()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
