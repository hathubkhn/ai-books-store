import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedRoadmap() {
  console.log("🌱 Seeding roadmap data...");

  // ==========================================
  // MACHINE LEARNING TRACK
  // ==========================================
  const mlTrack = await prisma.learningTrack.upsert({
    where: { slug: "machine-learning" },
    update: {},
    create: {
      slug: "machine-learning",
      name: "Machine Learning",
      nameEn: "Machine Learning",
      description:
        "Lộ trình học Machine Learning từ cơ bản đến nâng cao. Bắt đầu từ Python, qua xử lý dữ liệu, đến thuật toán ML và Deep Learning.",
      descriptionEn:
        "Complete Machine Learning learning path from basics to advanced. Start with Python, data processing, ML algorithms to Deep Learning.",
      icon: "Brain",
      level: "BEGINNER",
      displayOrder: 1,
      isActive: true,
    },
  });

  const mlStages = [
    {
      slug: "python-foundation",
      title: "Python Cơ Bản",
      titleEn: "Python Foundation",
      description:
        "Nắm vững cú pháp Python, cấu trúc dữ liệu, functions và OOP. Nền tảng cho mọi bước tiếp theo.",
      descriptionEn:
        "Master Python syntax, data structures, functions and OOP. Foundation for all next steps.",
      level: "FOUNDATION",
      displayOrder: 1,
      prerequisiteStageIds: [],
    },
    {
      slug: "data-processing",
      title: "Xử Lý Dữ Liệu",
      titleEn: "Data Processing",
      description:
        "Học NumPy, Pandas để xử lý và phân tích dữ liệu. Visualization với Matplotlib/Seaborn.",
      descriptionEn:
        "Learn NumPy, Pandas for data processing and analysis. Visualization with Matplotlib/Seaborn.",
      level: "BEGINNER",
      displayOrder: 2,
      prerequisiteStageIds: [],
    },
    {
      slug: "math-foundation",
      title: "Toán Học Cơ Bản",
      titleEn: "Mathematics Foundation",
      description:
        "Linear Algebra, Calculus, Probability & Statistics cần thiết cho ML.",
      descriptionEn:
        "Essential Linear Algebra, Calculus, Probability & Statistics for ML.",
      level: "BEGINNER",
      displayOrder: 3,
      prerequisiteStageIds: [],
      isOptional: true,
    },
    {
      slug: "ml-fundamentals",
      title: "Machine Learning Cơ Bản",
      titleEn: "ML Fundamentals",
      description:
        "Supervised Learning, Classification, Regression, Model Evaluation. Hands-on với scikit-learn.",
      descriptionEn:
        "Supervised Learning, Classification, Regression, Model Evaluation. Hands-on with scikit-learn.",
      level: "INTERMEDIATE",
      displayOrder: 4,
      prerequisiteStageIds: [],
    },
    {
      slug: "advanced-ml",
      title: "ML Nâng Cao",
      titleEn: "Advanced ML",
      description:
        "Ensemble methods, Feature Engineering, Model Tuning, Deployment.",
      descriptionEn:
        "Ensemble methods, Feature Engineering, Model Tuning, Deployment.",
      level: "INTERMEDIATE",
      displayOrder: 5,
      prerequisiteStageIds: [],
    },
    {
      slug: "deep-learning-intro",
      title: "Giới Thiệu Deep Learning",
      titleEn: "Deep Learning Introduction",
      description:
        "Neural Networks, Backpropagation, PyTorch/TensorFlow cơ bản.",
      descriptionEn:
        "Neural Networks, Backpropagation, basic PyTorch/TensorFlow.",
      level: "ADVANCED",
      displayOrder: 6,
      prerequisiteStageIds: [],
    },
  ];

  for (const stageData of mlStages) {
    await prisma.learningStage.upsert({
      where: {
        trackId_slug: {
          trackId: mlTrack.id,
          slug: stageData.slug,
        },
      },
      update: {},
      create: {
        ...stageData,
        trackId: mlTrack.id,
      },
    });
  }

  console.log("✅ Machine Learning track created");

  // ==========================================
  // COMPUTER VISION TRACK
  // ==========================================
  const cvTrack = await prisma.learningTrack.upsert({
    where: { slug: "computer-vision" },
    update: {},
    create: {
      slug: "computer-vision",
      name: "Computer Vision",
      nameEn: "Computer Vision",
      description:
        "Lộ trình học Computer Vision từ xử lý ảnh cơ bản đến Deep Learning, CNN, Object Detection và Vision Transformer.",
      descriptionEn:
        "Complete Computer Vision path from basic image processing to Deep Learning, CNN, Object Detection and Vision Transformer.",
      icon: "Eye",
      level: "INTERMEDIATE",
      displayOrder: 2,
      isActive: true,
    },
  });

  const cvStages = [
    {
      slug: "python-numpy",
      title: "Python & NumPy",
      titleEn: "Python & NumPy",
      description: "Python cơ bản và NumPy cho xử lý mảng đa chiều.",
      descriptionEn: "Basic Python and NumPy for multi-dimensional arrays.",
      level: "FOUNDATION",
      displayOrder: 1,
      prerequisiteStageIds: [],
    },
    {
      slug: "image-processing",
      title: "Xử Lý Ảnh Cơ Bản",
      titleEn: "Image Processing Basics",
      description:
        "OpenCV, xử lý ảnh cơ bản, filters, edge detection, transformations.",
      descriptionEn:
        "OpenCV, basic image processing, filters, edge detection, transformations.",
      level: "BEGINNER",
      displayOrder: 2,
      prerequisiteStageIds: [],
    },
    {
      slug: "ml-for-cv",
      title: "Machine Learning cho CV",
      titleEn: "Machine Learning for CV",
      description:
        "Traditional ML methods: HOG, SIFT, SVM cho image classification.",
      descriptionEn:
        "Traditional ML methods: HOG, SIFT, SVM for image classification.",
      level: "BEGINNER",
      displayOrder: 3,
      prerequisiteStageIds: [],
    },
    {
      slug: "deep-learning-pytorch",
      title: "Deep Learning & PyTorch",
      titleEn: "Deep Learning & PyTorch",
      description: "Neural Networks, PyTorch cơ bản, training workflow.",
      descriptionEn: "Neural Networks, basic PyTorch, training workflow.",
      level: "INTERMEDIATE",
      displayOrder: 4,
      prerequisiteStageIds: [],
    },
    {
      slug: "cnn-classification",
      title: "CNN & Classification",
      titleEn: "CNN & Classification",
      description:
        "Convolutional Neural Networks, Image Classification, Transfer Learning.",
      descriptionEn:
        "Convolutional Neural Networks, Image Classification, Transfer Learning.",
      level: "INTERMEDIATE",
      displayOrder: 5,
      prerequisiteStageIds: [],
    },
    {
      slug: "object-detection",
      title: "Object Detection",
      titleEn: "Object Detection",
      description: "YOLO, R-CNN, Object Detection architectures và applications.",
      descriptionEn: "YOLO, R-CNN, Object Detection architectures and applications.",
      level: "ADVANCED",
      displayOrder: 6,
      prerequisiteStageIds: [],
    },
    {
      slug: "vision-transformer",
      title: "Vision Transformer",
      titleEn: "Vision Transformer",
      description:
        "Attention mechanism, ViT, CLIP, modern CV architectures.",
      descriptionEn:
        "Attention mechanism, ViT, CLIP, modern CV architectures.",
      level: "ADVANCED",
      displayOrder: 7,
      prerequisiteStageIds: [],
      isOptional: true,
    },
  ];

  for (const stageData of cvStages) {
    await prisma.learningStage.upsert({
      where: {
        trackId_slug: {
          trackId: cvTrack.id,
          slug: stageData.slug,
        },
      },
      update: {},
      create: {
        ...stageData,
        trackId: cvTrack.id,
      },
    });
  }

  console.log("✅ Computer Vision track created");

  // ==========================================
  // DEEP LEARNING TRACK
  // ==========================================
  const dlTrack = await prisma.learningTrack.upsert({
    where: { slug: "deep-learning" },
    update: {},
    create: {
      slug: "deep-learning",
      name: "Deep Learning",
      nameEn: "Deep Learning",
      description:
        "Lộ trình học Deep Learning từ Neural Networks cơ bản đến CNN, RNN, Transformer và các kiến trúc hiện đại.",
      descriptionEn:
        "Complete Deep Learning path from basic Neural Networks to CNN, RNN, Transformer and modern architectures.",
      icon: "Sparkles",
      level: "INTERMEDIATE",
      displayOrder: 3,
      isActive: true,
    },
  });

  const dlStages = [
    {
      slug: "python-ml-basics",
      title: "Python & ML Cơ Bản",
      titleEn: "Python & ML Basics",
      description: "Python, NumPy, scikit-learn, Machine Learning basics.",
      descriptionEn: "Python, NumPy, scikit-learn, Machine Learning basics.",
      level: "FOUNDATION",
      displayOrder: 1,
      prerequisiteStageIds: [],
    },
    {
      slug: "neural-networks",
      title: "Neural Networks",
      titleEn: "Neural Networks",
      description:
        "Perceptron, Multi-layer networks, Backpropagation, Activation functions.",
      descriptionEn:
        "Perceptron, Multi-layer networks, Backpropagation, Activation functions.",
      level: "BEGINNER",
      displayOrder: 2,
      prerequisiteStageIds: [],
    },
    {
      slug: "pytorch-tensorflow",
      title: "PyTorch/TensorFlow",
      titleEn: "PyTorch/TensorFlow",
      description:
        "Deep Learning frameworks, tensor operations, automatic differentiation.",
      descriptionEn:
        "Deep Learning frameworks, tensor operations, automatic differentiation.",
      level: "INTERMEDIATE",
      displayOrder: 3,
      prerequisiteStageIds: [],
    },
    {
      slug: "cnn",
      title: "Convolutional Neural Networks",
      titleEn: "Convolutional Neural Networks",
      description:
        "CNN architectures, image classification, transfer learning.",
      descriptionEn:
        "CNN architectures, image classification, transfer learning.",
      level: "INTERMEDIATE",
      displayOrder: 4,
      prerequisiteStageIds: [],
    },
    {
      slug: "rnn-lstm",
      title: "RNN & LSTM",
      titleEn: "RNN & LSTM",
      description:
        "Recurrent networks, sequence modeling, time series, NLP basics.",
      descriptionEn:
        "Recurrent networks, sequence modeling, time series, NLP basics.",
      level: "INTERMEDIATE",
      displayOrder: 5,
      prerequisiteStageIds: [],
    },
    {
      slug: "transformer",
      title: "Transformer & Attention",
      titleEn: "Transformer & Attention",
      description:
        "Attention mechanism, Transformer architecture, BERT, GPT basics.",
      descriptionEn:
        "Attention mechanism, Transformer architecture, BERT, GPT basics.",
      level: "ADVANCED",
      displayOrder: 6,
      prerequisiteStageIds: [],
    },
    {
      slug: "advanced-dl",
      title: "Advanced Deep Learning",
      titleEn: "Advanced Deep Learning",
      description:
        "GANs, VAEs, Reinforcement Learning, Meta-learning, Research topics.",
      descriptionEn:
        "GANs, VAEs, Reinforcement Learning, Meta-learning, Research topics.",
      level: "ADVANCED",
      displayOrder: 7,
      prerequisiteStageIds: [],
      isOptional: true,
    },
  ];

  for (const stageData of dlStages) {
    await prisma.learningStage.upsert({
      where: {
        trackId_slug: {
          trackId: dlTrack.id,
          slug: stageData.slug,
        },
      },
      update: {},
      create: {
        ...stageData,
        trackId: dlTrack.id,
      },
    });
  }

  console.log("✅ Deep Learning track created");

  // ==========================================
  // GENERATIVE AI TRACK
  // ==========================================
  const genaiTrack = await prisma.learningTrack.upsert({
    where: { slug: "generative-ai" },
    update: {},
    create: {
      slug: "generative-ai",
      name: "Generative AI & LLM",
      nameEn: "Generative AI & LLM",
      description:
        "Lộ trình học Generative AI và Large Language Models. Từ Transformer đến GPT, DALL-E, và ứng dụng thực tế.",
      descriptionEn:
        "Complete Generative AI and LLM learning path. From Transformer to GPT, DALL-E, and practical applications.",
      icon: "Wand2",
      level: "ADVANCED",
      displayOrder: 4,
      isActive: true,
    },
  });

  const genaiStages = [
    {
      slug: "python-ml-dl",
      title: "Python, ML & DL Foundation",
      titleEn: "Python, ML & DL Foundation",
      description: "Python, Machine Learning và Deep Learning cơ bản.",
      descriptionEn: "Python, Machine Learning and Deep Learning basics.",
      level: "FOUNDATION",
      displayOrder: 1,
      prerequisiteStageIds: [],
    },
    {
      slug: "nlp-basics",
      title: "NLP Cơ Bản",
      titleEn: "NLP Basics",
      description:
        "Text processing, tokenization, embeddings, sequence models.",
      descriptionEn:
        "Text processing, tokenization, embeddings, sequence models.",
      level: "BEGINNER",
      displayOrder: 2,
      prerequisiteStageIds: [],
    },
    {
      slug: "transformer-architecture",
      title: "Transformer Architecture",
      titleEn: "Transformer Architecture",
      description:
        "Attention mechanism, Transformer, BERT, GPT architecture.",
      descriptionEn:
        "Attention mechanism, Transformer, BERT, GPT architecture.",
      level: "INTERMEDIATE",
      displayOrder: 3,
      prerequisiteStageIds: [],
    },
    {
      slug: "large-language-models",
      title: "Large Language Models",
      titleEn: "Large Language Models",
      description: "GPT-3/4, training, fine-tuning, prompting techniques.",
      descriptionEn: "GPT-3/4, training, fine-tuning, prompting techniques.",
      level: "INTERMEDIATE",
      displayOrder: 4,
      prerequisiteStageIds: [],
    },
    {
      slug: "image-generation",
      title: "Image Generation",
      titleEn: "Image Generation",
      description:
        "GANs, Diffusion models, DALL-E, Stable Diffusion, Midjourney.",
      descriptionEn:
        "GANs, Diffusion models, DALL-E, Stable Diffusion, Midjourney.",
      level: "ADVANCED",
      displayOrder: 5,
      prerequisiteStageIds: [],
    },
    {
      slug: "genai-applications",
      title: "Ứng Dụng GenAI",
      titleEn: "GenAI Applications",
      description:
        "Building apps with LangChain, Vector DBs, RAG, Agents, Production deployment.",
      descriptionEn:
        "Building apps with LangChain, Vector DBs, RAG, Agents, Production deployment.",
      level: "ADVANCED",
      displayOrder: 6,
      prerequisiteStageIds: [],
    },
  ];

  for (const stageData of genaiStages) {
    await prisma.learningStage.upsert({
      where: {
        trackId_slug: {
          trackId: genaiTrack.id,
          slug: stageData.slug,
        },
      },
      update: {},
      create: {
        ...stageData,
        trackId: genaiTrack.id,
      },
    });
  }

  console.log("✅ Generative AI track created");

  console.log("🎉 Roadmap seeding completed!");
}

seedRoadmap()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
