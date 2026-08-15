// Assessment questions for each learning track

interface Question {
  id: string;
  question: string;
  questionEn?: string;
  options: Array<{
    id: string;
    label: string;
    labelEn?: string;
    score: number;
  }>;
}

export const MACHINE_LEARNING_QUESTIONS: Question[] = [
  {
    id: "ml-python",
    question: "Bạn đánh giá khả năng lập trình Python của mình như thế nào?",
    questionEn: "How would you rate your Python programming skills?",
    options: [
      { id: "beginner", label: "Chưa biết hoặc mới bắt đầu", score: 0 },
      { id: "basic", label: "Biết cú pháp cơ bản, có thể viết script đơn giản", score: 1 },
      { id: "intermediate", label: "Thành thạo, có kinh nghiệm với OOP và thư viện", score: 2 },
      { id: "advanced", label: "Chuyên sâu, đã phát triển nhiều dự án phức tạp", score: 3 },
    ],
  },
  {
    id: "ml-math",
    question: "Kiến thức về toán học (Linear Algebra, Calculus, Statistics)?",
    questionEn: "Your knowledge of mathematics (Linear Algebra, Calculus, Statistics)?",
    options: [
      { id: "no", label: "Không có hoặc quên rồi", score: 0 },
      { id: "basic", label: "Biết cơ bản, nhưng cần ôn lại", score: 1 },
      { id: "good", label: "Tốt, đã học đại học hoặc tự học", score: 2 },
      { id: "strong", label: "Rất tốt, thành thạo các khái niệm", score: 3 },
    ],
  },
  {
    id: "ml-experience",
    question: "Bạn đã có kinh nghiệm với Machine Learning chưa?",
    questionEn: "Do you have experience with Machine Learning?",
    options: [
      { id: "no", label: "Chưa, hoàn toàn mới", score: 0 },
      { id: "theory", label: "Đã học lý thuyết nhưng chưa làm dự án", score: 1 },
      { id: "projects", label: "Đã làm vài dự án nhỏ hoặc tutorial", score: 2 },
      { id: "professional", label: "Đã làm việc thực tế hoặc nghiên cứu", score: 3 },
    ],
  },
];

export const COMPUTER_VISION_QUESTIONS: Question[] = [
  {
    id: "cv-python",
    question: "Bạn có kinh nghiệm lập trình Python không?",
    options: [
      { id: "no", label: "Chưa biết", score: 0 },
      { id: "basic", label: "Biết cơ bản", score: 1 },
      { id: "good", label: "Thành thạo", score: 2 },
      { id: "expert", label: "Chuyên sâu", score: 3 },
    ],
  },
  {
    id: "cv-opencv",
    question: "Bạn đã từng làm việc với xử lý ảnh (OpenCV, PIL) chưa?",
    options: [
      { id: "no", label: "Chưa bao giờ", score: 0 },
      { id: "basic", label: "Đã biết cơ bản", score: 1 },
      { id: "experienced", label: "Có kinh nghiệm", score: 2 },
      { id: "advanced", label: "Chuyên sâu", score: 3 },
    ],
  },
  {
    id: "cv-dl",
    question: "Kiến thức về Deep Learning và CNN?",
    options: [
      { id: "no", label: "Chưa biết gì", score: 0 },
      { id: "theory", label: "Biết lý thuyết cơ bản", score: 1 },
      { id: "practical", label: "Đã làm dự án", score: 2 },
      { id: "research", label: "Nghiên cứu hoặc làm việc chuyên sâu", score: 3 },
    ],
  },
];

export const DEEP_LEARNING_QUESTIONS: Question[] = [
  {
    id: "dl-ml",
    question: "Bạn đã học Machine Learning cơ bản chưa?",
    options: [
      { id: "no", label: "Chưa", score: 0 },
      { id: "learning", label: "Đang học", score: 1 },
      { id: "completed", label: "Đã hoàn thành", score: 2 },
      { id: "expert", label: "Thành thạo", score: 3 },
    ],
  },
  {
    id: "dl-nn",
    question: "Hiểu biết về Neural Networks?",
    options: [
      { id: "no", label: "Chưa biết", score: 0 },
      { id: "theory", label: "Biết lý thuyết", score: 1 },
      { id: "implemented", label: "Đã implement từ scratch", score: 2 },
      { id: "frameworks", label: "Thành thạo PyTorch/TensorFlow", score: 3 },
    ],
  },
  {
    id: "dl-projects",
    question: "Kinh nghiệm làm dự án Deep Learning?",
    options: [
      { id: "no", label: "Chưa làm", score: 0 },
      { id: "tutorial", label: "Theo tutorial", score: 1 },
      { id: "personal", label: "Dự án cá nhân", score: 2 },
      { id: "professional", label: "Dự án thực tế hoặc nghiên cứu", score: 3 },
    ],
  },
];

export const GENERATIVE_AI_QUESTIONS: Question[] = [
  {
    id: "genai-dl",
    question: "Kiến thức về Deep Learning?",
    options: [
      { id: "no", label: "Chưa biết", score: 0 },
      { id: "basic", label: "Cơ bản", score: 1 },
      { id: "intermediate", label: "Trung bình", score: 2 },
      { id: "advanced", label: "Nâng cao", score: 3 },
    ],
  },
  {
    id: "genai-transformer",
    question: "Bạn có hiểu về Transformer architecture không?",
    options: [
      { id: "no", label: "Chưa", score: 0 },
      { id: "heard", label: "Đã nghe qua", score: 1 },
      { id: "understand", label: "Hiểu cơ chế hoạt động", score: 2 },
      { id: "implemented", label: "Đã implement hoặc fine-tune", score: 3 },
    ],
  },
  {
    id: "genai-llm",
    question: "Kinh nghiệm với LLMs (GPT, BERT, etc.)?",
    options: [
      { id: "no", label: "Chưa sử dụng", score: 0 },
      { id: "api", label: "Dùng qua API", score: 1 },
      { id: "finetune", label: "Đã fine-tune hoặc prompt engineering", score: 2 },
      { id: "train", label: "Đã training hoặc nghiên cứu", score: 3 },
    ],
  },
];

export function getQuestionsForTrack(trackSlug: string): Question[] {
  switch (trackSlug) {
    case "machine-learning":
      return MACHINE_LEARNING_QUESTIONS;
    case "computer-vision":
      return COMPUTER_VISION_QUESTIONS;
    case "deep-learning":
      return DEEP_LEARNING_QUESTIONS;
    case "generative-ai":
      return GENERATIVE_AI_QUESTIONS;
    default:
      return MACHINE_LEARNING_QUESTIONS;
  }
}
