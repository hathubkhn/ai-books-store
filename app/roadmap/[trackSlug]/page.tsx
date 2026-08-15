"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LearningAssessment from "@/components/roadmap/LearningAssessment";
import { getQuestionsForTrack } from "@/lib/roadmap-questions";
import { Loader2 } from "lucide-react";

export default function RoadmapTrackPage() {
  const params = useParams();
  const router = useRouter();
  const trackSlug = params.trackSlug as string;

  const [track, setTrack] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);

  useEffect(() => {
    fetchTrack();
  }, [trackSlug]);

  const fetchTrack = async () => {
    try {
      const res = await fetch(`/api/roadmap/tracks/${trackSlug}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Lỗi tải lộ trình");
      }

      setTrack(data.track);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAssessment = () => {
    setShowAssessment(true);
  };

  const handleAssessmentComplete = (recommendation: any) => {
    // Store recommendation in sessionStorage
    sessionStorage.setItem(
      `roadmap-${trackSlug}`,
      JSON.stringify(recommendation)
    );

    // Navigate to result page
    router.push(`/roadmap/${trackSlug}/result`);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="section-padding min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !track) {
    return (
      <>
        <Header />
        <main className="section-padding">
          <div className="container-custom text-center">
            <h1 className="font-serif text-3xl font-semibold mb-4">
              Không tìm thấy lộ trình
            </h1>
            <p className="text-foreground-secondary mb-6">{error}</p>
            <a href="/roadmap" className="btn-primary">
              Quay lại
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const questions = getQuestionsForTrack(trackSlug);

  return (
    <>
      <Header />
      <main className="section-padding">
        <div className="container-custom">
          {!showAssessment ? (
            // Track Overview
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <a
                  href="/roadmap"
                  className="text-accent text-sm hover:underline mb-4 inline-block"
                >
                  ← Quay lại tất cả lộ trình
                </a>
                <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
                  {track.name}
                </h1>
                <p className="text-xl text-foreground-secondary">
                  {track.description}
                </p>
              </div>

              {/* Stages Preview */}
              <div className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-6">
                  Tổng quan lộ trình
                </h2>
                <div className="space-y-3">
                  {track.stages.map((stage: any, index: number) => (
                    <div key={stage.id} className="card p-4 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface flex items-center justify-center font-medium text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{stage.title}</h3>
                        <p className="text-sm text-foreground-secondary">
                          {stage.description}
                        </p>
                        <div className="mt-2 text-xs text-foreground-secondary">
                          <span className="px-2 py-1 bg-surface rounded-sm">
                            {stage.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="card bg-accent-soft border-accent/20 text-center p-8">
                <h2 className="font-serif text-2xl font-semibold mb-3">
                  Sẵn sàng bắt đầu?
                </h2>
                <p className="text-foreground-secondary mb-6 max-w-2xl mx-auto">
                  Trả lời {questions.length} câu hỏi ngắn để chúng tôi hiểu trình
                  độ hiện tại của bạn. Sau đó, chúng tôi sẽ đề xuất điểm bắt đầu
                  phù hợp và bộ sách tối ưu.
                </p>
                <button onClick={handleStartAssessment} className="btn-primary">
                  Bắt đầu đánh giá ({questions.length} câu hỏi)
                </button>
                <p className="text-xs text-foreground-secondary mt-4">
                  ⏱ Mất khoảng 2-3 phút
                </p>
              </div>
            </div>
          ) : (
            // Assessment
            <LearningAssessment
              trackSlug={trackSlug}
              trackName={track.name}
              questions={questions}
              onComplete={handleAssessmentComplete}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
