"use client";

import { useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";

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

interface LearningAssessmentProps {
  trackSlug: string;
  trackName: string;
  questions: Question[];
  onComplete: (recommendation: any) => void;
}

export default function LearningAssessment({
  trackSlug,
  trackName,
  questions,
  onComplete,
}: LearningAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = async () => {
    if (!answers[currentQuestion.id]) {
      return; // No answer selected
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit assessment
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
        })
      );

      const res = await fetch("/api/roadmap/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackSlug,
          answers: formattedAnswers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Lỗi gửi đánh giá");
      }

      onComplete(data.recommendation);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const isAnswered = !!answers[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-foreground-secondary mb-2">
          <span>
            Câu hỏi {currentQuestionIndex + 1} / {questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="card mb-8">
        <h3 className="font-serif text-2xl md:text-3xl font-semibold mb-6">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id)}
              className={`w-full text-left p-4 rounded-sm border-2 transition-all ${
                answers[currentQuestion.id] === option.id
                  ? "border-accent bg-accent-soft"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <p className="font-medium">{option.label}</p>
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Quay lại
        </button>

        <button
          onClick={handleNext}
          disabled={!isAnswered || isSubmitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang xử lý...
            </>
          ) : isLastQuestion ? (
            "Hoàn thành"
          ) : (
            <>
              Tiếp theo
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
