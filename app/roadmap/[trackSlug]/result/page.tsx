"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RoadmapVisualization from "@/components/roadmap/RoadmapVisualization";
import BookCard from "@/components/books/BookCard";
import { Loader2, Sparkles } from "lucide-react";

export default function RoadmapResultPage() {
  const params = useParams();
  const router = useRouter();
  const trackSlug = params.trackSlug as string;

  const [track, setTrack] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get recommendation from sessionStorage
    const stored = sessionStorage.getItem(`roadmap-${trackSlug}`);
    if (!stored) {
      router.push(`/roadmap/${trackSlug}`);
      return;
    }

    setRecommendation(JSON.parse(stored));
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

  if (error || !track || !recommendation) {
    return (
      <>
        <Header />
        <main className="section-padding">
          <div className="container-custom text-center">
            <h1 className="font-serif text-3xl font-semibold mb-4">
              Không tìm thấy kết quả
            </h1>
            <p className="text-foreground-secondary mb-6">{error}</p>
            <a href={`/roadmap/${trackSlug}`} className="btn-primary">
              Làm lại đánh giá
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentStage = track.stages.find(
    (s: any) => s.id === recommendation.startingStageId
  );

  // Get recommended books for current stage
  const recommendedBooks =
    currentStage?.bookMappings.map((m: any) => m.book) || [];

  // Get next stage
  const nextStageIndex = track.stages.findIndex(
    (s: any) => s.id === recommendation.startingStageId
  );
  const nextStage = track.stages[nextStageIndex + 1];

  return (
    <>
      <Header />
      <main className="section-padding">
        <div className="container-custom">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-soft rounded-full text-accent font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Lộ trình cá nhân hóa của bạn
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
              {track.name}
            </h1>
            <p className="text-xl text-foreground-secondary">
              Dựa trên đánh giá, chúng tôi đề xuất bạn bắt đầu từ giai đoạn{" "}
              <strong className="text-accent">{currentStage?.title}</strong>
            </p>
          </div>

          {/* Roadmap Visualization */}
          <div className="mb-16">
            <RoadmapVisualization
              stages={track.stages}
              completedStageIds={recommendation.completedStageIds || []}
              currentStageId={recommendation.startingStageId}
            />
          </div>

          {/* Current Stage Focus */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="card bg-accent-soft border-accent/20 p-8">
              <h2 className="font-serif text-3xl font-semibold mb-4">
                🎯 Bắt đầu từ: {currentStage?.title}
              </h2>
              <p className="text-lg text-foreground-secondary mb-6">
                {currentStage?.description}
              </p>

              {recommendedBooks.length > 0 && (
                <>
                  <h3 className="font-serif text-xl font-semibold mb-4">
                    Sách đề xuất cho giai đoạn này:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendedBooks.slice(0, 3).map((book: any) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bundles */}
          {track.bundles && track.bundles.length > 0 && (
            <div className="max-w-5xl mx-auto mb-16">
              <h2 className="font-serif text-3xl font-semibold mb-6 text-center">
                📚 Combo Sách Đề Xuất
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {track.bundles.slice(0, 2).map((bundle: any) => {
                  const totalPrice = bundle.items.reduce(
                    (sum: number, item: any) => sum + item.book.price,
                    0
                  );
                  const discountAmount =
                    bundle.discountType === "PERCENTAGE"
                      ? (totalPrice * bundle.discountValue) / 100
                      : bundle.discountValue;
                  const finalPrice = totalPrice - discountAmount;

                  return (
                    <a
                      key={bundle.id}
                      href={`/bundle/${bundle.slug}`}
                      className="card hover:shadow-lg transition-shadow"
                    >
                      <h3 className="font-serif text-xl font-semibold mb-2">
                        {bundle.title}
                      </h3>
                      <p className="text-sm text-foreground-secondary mb-4">
                        {bundle.description}
                      </p>
                      <div className="text-sm text-foreground-secondary mb-3">
                        {bundle.items.length} cuốn sách
                      </div>
                      <div className="flex items-baseline gap-3 mb-4">
                        <span className="text-2xl font-bold text-accent">
                          {finalPrice.toLocaleString("vi-VN")}₫
                        </span>
                        <span className="text-sm text-foreground-secondary line-through">
                          {totalPrice.toLocaleString("vi-VN")}₫
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          Tiết kiệm {discountAmount.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      <div className="btn-primary text-center">Xem combo</div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl font-semibold mb-4">
              Bước tiếp theo
            </h2>
            <p className="text-foreground-secondary mb-6">
              {nextStage
                ? `Sau khi hoàn thành giai đoạn hiện tại, bạn sẽ tiếp tục với: ${nextStage.title}`
                : "Bạn đang ở giai đoạn cuối cùng của lộ trình này!"}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/books" className="btn-primary">
                Khám phá tất cả sách
              </a>
              <a href="/roadmap" className="btn-secondary">
                Xem lộ trình khác
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
