import Link from "next/link";
import { Brain, Eye, Sparkles, Wand2, Database, Code } from "lucide-react";

interface RoadmapTrackCardProps {
  track: {
    slug: string;
    name: string;
    description: string;
    icon?: string;
    level?: string;
    _count?: {
      stages: number;
    };
  };
}

const iconMap: Record<string, any> = {
  Brain,
  Eye,
  Sparkles,
  Wand2,
  Database,
  Code,
};

export default function RoadmapTrackCard({ track }: RoadmapTrackCardProps) {
  const Icon = track.icon ? iconMap[track.icon] || Brain : Brain;

  return (
    <Link
      href={`/roadmap/${track.slug}`}
      className="card hover:shadow-lg transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
          <Icon className="w-6 h-6 text-accent" />
        </div>

        <div className="flex-1">
          <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
            {track.name}
          </h3>

          <p className="text-foreground-secondary text-sm mb-4 line-clamp-2">
            {track.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-foreground-secondary">
            {track._count && (
              <span>{track._count.stages} giai đoạn</span>
            )}
            {track.level && (
              <span className="px-2 py-1 bg-surface rounded-sm text-xs font-medium">
                {track.level}
              </span>
            )}
          </div>

          <div className="mt-4 text-accent text-sm font-medium group-hover:underline">
            Xây dựng lộ trình →
          </div>
        </div>
      </div>
    </Link>
  );
}
