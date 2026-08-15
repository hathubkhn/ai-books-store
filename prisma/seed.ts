import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "ai-first-steps" },
      update: {},
      create: {
        name: "AI First Steps",
        slug: "ai-first-steps",
        description: "A child's first introduction to AI through stories, illustrations, and interactive activities.",
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "exploring-ai" },
      update: {},
      create: {
        name: "Exploring AI",
        slug: "exploring-ai",
        description: "Explore how computers learn, recognize images, understand language, and solve problems.",
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "advanced-ai-foundations" },
      update: {},
      create: {
        name: "Advanced AI Foundations",
        slug: "advanced-ai-foundations",
        description: "Mathematics, programming, and Machine Learning foundations for students who want to go deeper into AI.",
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "ai-machine-learning" },
      update: {},
      create: {
        name: "AI & Machine Learning",
        slug: "ai-machine-learning",
        description: "Fundamental and advanced knowledge of Artificial Intelligence, Machine Learning, and Deep Learning.",
        sortOrder: 4,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "computer-vision" },
      update: {},
      create: {
        name: "Computer Vision",
        slug: "computer-vision",
        description: "Image processing, Deep Learning, CNNs, Transformers, and modern computer vision systems.",
        sortOrder: 5,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "algorithms-programming" },
      update: {},
      create: {
        name: "Algorithms & Programming",
        slug: "algorithms-programming",
        description: "Algorithmic thinking, data structures, and programming skills for computer science and AI.",
        sortOrder: 6,
        isActive: true,
      },
    }),
  ]);

  console.log("✓ Categories created");

  // Create Books
  const books = [
    // Category 1: AI First Steps
    {
      title: "My First AI & Robot Book",
      slug: "my-first-ai-robot-book",
      publisher: "Vietnam Education Publishing House",
      authors: "AI Books Editorial Team",
      shortDescription: "Join Robot Cloud on a journey to discover how computers see, hear, learn, and help people through simple stories and activities.",
      fullDescription: "This delightful book introduces young learners to the fascinating world of artificial intelligence through the adventures of Robot Cloud. Children will discover how computers can see pictures, understand voices, and even learn new things—just like they do! Through colorful illustrations and engaging activities, this book makes AI concepts accessible and fun for the youngest readers.",
      coverImage: "/images/books/ai-first-steps-1.svg",
      price: 129000,
      categoryId: categories[0].id,
      publishedYear: 2026,
      audience: "Grades 1–3",
      featured: true,
      isActive: true,
    },
    {
      title: "Discovering Artificial Intelligence",
      slug: "discovering-artificial-intelligence",
      publisher: "Kim Dong Publishing House",
      authors: "AI Books Editorial Team",
      shortDescription: "An introduction to AI using illustrations, puzzles, and examples from everyday life.",
      fullDescription: "What is AI? How does it work? This book answers these questions through beautiful illustrations and interactive puzzles. Children will explore real-world examples of AI in smartphones, games, and home devices, building a foundation for understanding this transformative technology.",
      coverImage: "/images/books/ai-first-steps-2.svg",
      price: 149000,
      categoryId: categories[0].id,
      publishedYear: 2026,
      audience: "Grades 3–5",
      featured: false,
      isActive: true,
    },
    {
      title: "50 Fascinating Questions About AI",
      slug: "50-questions-about-ai",
      publisher: "Vietnam National University Press",
      authors: "Nguyen Minh Anh, Tran Hoang",
      shortDescription: "Fifty questions helping children understand what AI is, whether robots can think, and how computers learn.",
      fullDescription: "Can robots think? Will AI take over the world? How do computers learn? This book tackles 50 of the most common questions children have about AI, providing clear, age-appropriate answers that spark curiosity and critical thinking.",
      coverImage: "/images/books/ai-first-steps-3.svg",
      price: 119000,
      categoryId: categories[0].id,
      publishedYear: 2026,
      audience: "Primary school students",
      featured: false,
      isActive: true,
    },

    // Category 2: Exploring AI
    {
      title: "AI Around Us",
      slug: "ai-around-us",
      publisher: "Vietnam Education Publishing House",
      authors: "AI Books Editorial Team",
      shortDescription: "Explore how AI is used in smartphones, social media, healthcare, transportation, and modern life.",
      fullDescription: "AI is everywhere—in your phone, on social media, in hospitals, and on the roads. This book takes middle school students on a tour of how AI impacts their daily lives, from recommendation algorithms to self-driving cars, making complex topics relatable and engaging.",
      coverImage: "/images/books/exploring-ai-1.svg",
      price: 169000,
      categoryId: categories[1].id,
      publishedYear: 2026,
      audience: "Grades 6–7",
      featured: true,
      isActive: true,
    },
    {
      title: "How Do Computers Learn?",
      slug: "how-computers-learn",
      publisher: "Vietnam National University Press",
      authors: "Nguyen Hoang Nam",
      shortDescription: "An intuitive introduction to Machine Learning through examples involving data, models, and prediction.",
      fullDescription: "This book demystifies machine learning by explaining how computers can learn from data without being explicitly programmed. Through intuitive examples and visual explanations, students will understand the basics of training models, making predictions, and the importance of data quality.",
      coverImage: "/images/books/exploring-ai-2.svg",
      price: 179000,
      categoryId: categories[1].id,
      publishedYear: 2026,
      audience: "Grades 7–9",
      featured: false,
      isActive: true,
    },
    {
      title: "AI Lab — 20 Projects for Students",
      slug: "ai-lab-20-projects",
      publisher: "Information and Communications Publishing House",
      authors: "Le Minh Duc, Pham Thao",
      shortDescription: "Twenty small projects that introduce students to AI through images, audio, chatbots, and data.",
      fullDescription: "Learn by doing! This hands-on book guides middle school students through 20 exciting AI projects, from building a simple chatbot to creating an image classifier. Each project includes step-by-step instructions and explanations of the underlying concepts.",
      coverImage: "/images/books/exploring-ai-3.svg",
      price: 219000,
      categoryId: categories[1].id,
      publishedYear: 2026,
      audience: "Middle school students",
      featured: false,
      isActive: true,
    },

    // Category 3: Advanced AI Foundations
    {
      title: "Introduction to Machine Learning for Students",
      slug: "intro-ml-students",
      publisher: "Science and Technology Publishing House",
      authors: "Nguyen Tuan Minh",
      shortDescription: "From Python to the first Machine Learning models for high school students.",
      fullDescription: "This comprehensive guide takes high school students from Python basics to building their first machine learning models. Covering supervised learning, unsupervised learning, and model evaluation, this book provides a solid foundation for future AI studies.",
      coverImage: "/images/books/advanced-foundations-1.svg",
      price: 249000,
      categoryId: categories[2].id,
      publishedYear: 2026,
      audience: "Grades 10–12",
      featured: true,
      isActive: true,
    },
    {
      title: "Mathematics for Artificial Intelligence",
      slug: "math-for-ai",
      publisher: "Vietnam National University Press",
      authors: "Tran Duc Long",
      shortDescription: "Vectors, matrices, probability, and derivatives explained from the perspective of a beginner studying AI.",
      fullDescription: "AI is built on mathematics. This book introduces the essential mathematical concepts needed for AI and machine learning—linear algebra, probability, calculus—in an accessible way, with examples drawn directly from AI applications.",
      coverImage: "/images/books/advanced-foundations-2.svg",
      price: 239000,
      categoryId: categories[2].id,
      publishedYear: 2026,
      audience: "High school students",
      featured: false,
      isActive: true,
    },
    {
      title: "Python & AI Projects",
      slug: "python-ai-projects",
      publisher: "Information and Communications Publishing House",
      authors: "Le Quang Huy",
      shortDescription: "Learn Python through practical prediction, classification, and data processing problems.",
      fullDescription: "Master Python while building real AI projects! This book combines programming fundamentals with practical AI applications, teaching students to work with data, build predictive models, and solve real-world problems.",
      coverImage: "/images/books/advanced-foundations-3.svg",
      price: 269000,
      categoryId: categories[2].id,
      publishedYear: 2026,
      audience: "High school students",
      featured: false,
      isActive: true,
    },

    // Category 4: AI & Machine Learning
    {
      title: "Foundations of Artificial Intelligence",
      slug: "foundations-ai",
      publisher: "Hanoi University of Science and Technology Publishing House",
      authors: "Nguyen Thanh Nam, Tran Minh Hoang",
      shortDescription: "A foundational textbook covering search, knowledge representation, Machine Learning, and modern AI systems.",
      fullDescription: "This comprehensive textbook covers the fundamental concepts of artificial intelligence, from classical search algorithms and knowledge representation to modern machine learning techniques. Designed for university students, it balances theory with practical implementations.",
      coverImage: "/images/books/ai-ml-1.svg",
      price: 329000,
      categoryId: categories[3].id,
      publishedYear: 2026,
      audience: "University students",
      featured: true,
      isActive: true,
    },
    {
      title: "Machine Learning — From Principles to Practice",
      slug: "ml-principles-practice",
      publisher: "Science and Technology Publishing House",
      authors: "Le Anh Tuan",
      shortDescription: "Connect the mathematical foundations of Machine Learning with practical Python implementations.",
      fullDescription: "This book bridges the gap between ML theory and practice, explaining the mathematical principles behind popular algorithms while demonstrating their implementation in Python. Perfect for students who want to deeply understand how ML works.",
      coverImage: "/images/books/ai-ml-2.svg",
      price: 359000,
      categoryId: categories[3].id,
      publishedYear: 2026,
      audience: "University students and engineers",
      featured: false,
      isActive: true,
    },
    {
      title: "Deep Learning — Architectures and Applications",
      slug: "deep-learning-architectures",
      publisher: "Hanoi University of Science and Technology Publishing House",
      authors: "Nguyen Minh Duc",
      shortDescription: "Neural Networks, CNNs, RNNs, Attention, and Transformers from fundamentals to applications.",
      fullDescription: "Dive deep into modern neural network architectures! This book covers everything from basic neural networks to cutting-edge transformer models, explaining how each architecture works and when to use it. Includes practical examples in PyTorch and TensorFlow.",
      coverImage: "/images/books/ai-ml-3.svg",
      price: 389000,
      categoryId: categories[3].id,
      publishedYear: 2026,
      audience: "Senior university students and graduate students",
      featured: false,
      isActive: true,
    },

    // Category 5: Computer Vision
    {
      title: "Computer Vision — From Pixels to Transformers",
      slug: "computer-vision-pixels-transformers",
      publisher: "Hanoi University of Science and Technology Publishing House",
      authors: "Nguyen Minh Hai, Tran Quoc Anh",
      shortDescription: "A journey from classical image processing to CNNs, Vision Transformers, and modern computer vision systems.",
      fullDescription: "This comprehensive guide takes readers from the fundamentals of image processing through classical computer vision techniques to state-of-the-art deep learning models. Covering CNNs, object detection, segmentation, and vision transformers, this book is essential for anyone working in computer vision.",
      coverImage: "/images/books/cv-1.svg",
      price: 399000,
      categoryId: categories[4].id,
      publishedYear: 2026,
      audience: "University students, graduate students, AI engineers",
      featured: true,
      isActive: true,
    },
    {
      title: "Deep Learning for Computer Vision",
      slug: "deep-learning-cv",
      publisher: "Science and Technology Publishing House",
      authors: "Le Thanh Cong",
      shortDescription: "Hands-on classification, detection, segmentation, and transfer learning using Deep Learning.",
      fullDescription: "Master deep learning for computer vision with this practical guide. Learn to build image classifiers, object detectors, and semantic segmentation models using modern deep learning frameworks. Includes code examples and best practices from industry.",
      coverImage: "/images/books/cv-2.svg",
      price: 379000,
      categoryId: categories[4].id,
      publishedYear: 2026,
      audience: "AI Engineers",
      featured: false,
      isActive: true,
    },
    {
      title: "Practical OpenCV & Image Processing",
      slug: "opencv-image-processing",
      publisher: "Information and Communications Publishing House",
      authors: "Pham Duc Minh",
      shortDescription: "Practical image processing and Computer Vision techniques using Python and OpenCV.",
      fullDescription: "Get hands-on with OpenCV! This practical guide teaches essential image processing techniques and computer vision algorithms using Python and OpenCV. Perfect for developers who want to add vision capabilities to their applications.",
      coverImage: "/images/books/cv-3.svg",
      price: 319000,
      categoryId: categories[4].id,
      publishedYear: 2026,
      audience: "University students and developers",
      featured: false,
      isActive: true,
    },

    // Category 6: Algorithms & Programming
    {
      title: "Algorithmic Thinking",
      slug: "algorithmic-thinking",
      publisher: "Hanoi University of Science and Technology Publishing House",
      authors: "Nguyen Duc Thanh",
      shortDescription: "Develop problem-solving skills through algorithms, complexity analysis, and common algorithm design strategies.",
      fullDescription: "Learn to think like a computer scientist! This book develops algorithmic thinking skills through carefully chosen problems and solutions. Covers algorithm design techniques, complexity analysis, and problem-solving strategies essential for computer science and AI.",
      coverImage: "/images/books/algo-1.svg",
      price: 289000,
      categoryId: categories[5].id,
      publishedYear: 2026,
      audience: "High school students and university students",
      featured: true,
      isActive: true,
    },
    {
      title: "Data Structures and Algorithms with Python",
      slug: "dsa-python",
      publisher: "Science and Technology Publishing House",
      authors: "Tran Quoc Viet",
      shortDescription: "From arrays, linked lists, trees, and graphs to searching and optimization algorithms.",
      fullDescription: "Master data structures and algorithms using Python! This comprehensive guide covers fundamental data structures and algorithms with clear explanations, visual diagrams, and Python implementations. Essential for technical interviews and competitive programming.",
      coverImage: "/images/books/algo-2.svg",
      price: 309000,
      categoryId: categories[5].id,
      publishedYear: 2026,
      audience: "Computer Science students",
      featured: false,
      isActive: true,
    },
    {
      title: "100 Programming & Algorithm Problems",
      slug: "100-programming-problems",
      publisher: "Vietnam National University Press",
      authors: "Le Minh Quan",
      shortDescription: "One hundred problems organized by difficulty to strengthen programming and algorithmic thinking.",
      fullDescription: "Practice makes perfect! This book contains 100 carefully selected programming and algorithm problems, ranging from beginner to advanced. Each problem includes detailed solutions and explanations, helping readers strengthen their problem-solving skills.",
      coverImage: "/images/books/algo-3.svg",
      price: 269000,
      categoryId: categories[5].id,
      publishedYear: 2026,
      audience: "High school and university students",
      featured: false,
      isActive: true,
    },
  ];

  for (const bookData of books) {
    await prisma.book.upsert({
      where: { slug: bookData.slug },
      update: {},
      create: bookData,
    });
  }

  console.log("✓ Books created");
  console.log(`\n✅ Seed completed successfully!`);
  console.log(`   - ${categories.length} categories created`);
  console.log(`   - ${books.length} books created`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
