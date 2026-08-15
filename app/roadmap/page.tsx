import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RoadmapTrackCard from "@/components/roadmap/RoadmapTrackCard";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Lộ trình học AI - AI Books",
  description:
    "Không biết nên bắt đầu từ cuốn nào? Hãy chọn mục tiêu của bạn, chúng tôi sẽ giúp xây dựng lộ trình đọc phù hợp.",
};

export default async function RoadmapHubPage() {
  const tracks = await prisma.learningTrack.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: { stages: true },
      },
    },
  });

  return (
    <>
      <Header />
      <main className="section-padding">
        <div className="container-custom max-w-6xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold mb-6">
              Học AI không nhất thiết phải mua thật nhiều sách.
            </h1>
            <p className="text-xl text-foreground-secondary max-w-3xl mx-auto mb-8">
              Điều quan trọng là đọc <strong>đúng cuốn, đúng thời điểm</strong>.
              <br />
              Chọn lĩnh vực và trình độ hiện tại của bạn. Chúng tôi sẽ đề xuất lộ
              trình và những cuốn sách phù hợp nhất.
            </p>
          </div>

          {/* Track Grid */}
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-8">
              Chọn lĩnh vực bạn muốn học
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tracks.map((track) => (
                <RoadmapTrackCard 
                  key={track.id} 
                  track={{
                    slug: track.slug,
                    name: track.name,
                    description: track.description,
                    icon: track.icon || undefined,
                    level: track.level || undefined,
                    _count: track._count
                  }} 
                />
              ))}
            </div>
          </div>

          {/* Value Proposition */}
          <div className="mt-20 bg-surface-light rounded-sm p-8 md:p-12">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-6 text-center">
              Tại sao nên sử dụng Lộ trình học?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="editorial-number">01</div>
                <h3 className="font-serif text-xl font-semibold mb-3">
                  Cá nhân hóa
                </h3>
                <p className="text-foreground-secondary text-sm">
                  Dựa trên trình độ hiện tại của bạn để đề xuất điểm bắt đầu phù
                  hợp nhất.
                </p>
              </div>

              <div className="text-center">
                <div className="editorial-number">02</div>
                <h3 className="font-serif text-xl font-semibold mb-3">
                  Tiết kiệm thời gian
                </h3>
                <p className="text-foreground-secondary text-sm">
                  Không phải tự tìm hiểu nên học gì tiếp theo. Chúng tôi đã
                  thiết kế lộ trình tối ưu.
                </p>
              </div>

              <div className="text-center">
                <div className="editorial-number">03</div>
                <h3 className="font-serif text-xl font-semibold mb-3">
                  Tiết kiệm chi phí
                </h3>
                <p className="text-foreground-secondary text-sm">
                  Mua combo sách theo lộ trình được giảm giá đáng kể so với mua
                  riêng lẻ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
