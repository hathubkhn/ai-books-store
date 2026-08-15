"use client";

import { Check, Lock, PlayCircle } from "lucide-react";

interface Stage {
  id: number;
  title: string;
  description: string;
  level: string;
  displayOrder: number;
}

interface RoadmapVisualizationProps {
  stages: Stage[];
  completedStageIds: number[];
  currentStageId?: number;
}

export default function RoadmapVisualization({
  stages,
  completedStageIds,
  currentStageId,
}: RoadmapVisualizationProps) {
  const getStageStatus = (stageId: number) => {
    if (completedStageIds.includes(stageId)) {
      return "completed";
    }
    if (stageId === currentStageId) {
      return "current";
    }
    return "upcoming";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "FOUNDATION":
        return "bg-blue-100 text-blue-700";
      case "BEGINNER":
        return "bg-green-100 text-green-700";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-700";
      case "ADVANCED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="relative">
      {/* Desktop: Horizontal with connecting lines */}
      <div className="hidden lg:block">
        <div className="relative flex items-start justify-between">
          {/* Connection Line */}
          <div className="absolute top-12 left-0 right-0 h-0.5 bg-surface z-0" />

          {stages.map((stage) => {
            const status = getStageStatus(stage.id);

            return (
              <div
                key={stage.id}
                className="relative flex-1 flex flex-col items-center z-10"
              >
                {/* Icon */}
                <div
                  className={`w-24 h-24 rounded-full border-4 flex items-center justify-center mb-4 ${
                    status === "completed"
                      ? "bg-[#476A55] border-[#476A55] text-white"
                      : status === "current"
                      ? "bg-accent border-accent text-white animate-pulse"
                      : "bg-white border-surface text-foreground-secondary"
                  }`}
                >
                  {status === "completed" ? (
                    <Check className="w-10 h-10" />
                  ) : status === "current" ? (
                    <PlayCircle className="w-10 h-10" />
                  ) : (
                    <Lock className="w-8 h-8" />
                  )}
                </div>

                {/* Content */}
                <div className="text-center px-2 max-w-[200px]">
                  <h3
                    className={`font-serif text-lg font-semibold mb-2 ${
                      status === "current" ? "text-accent" : ""
                    }`}
                  >
                    {stage.title}
                  </h3>
                  <p className="text-xs text-foreground-secondary mb-2 line-clamp-2">
                    {stage.description}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 rounded-sm text-xs font-medium ${getLevelColor(
                      stage.level
                    )}`}
                  >
                    {stage.level}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical stepper */}
      <div className="lg:hidden space-y-6">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.id);
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.id} className="relative flex gap-4">
              {/* Vertical line */}
              {!isLast && (
                <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-surface" />
              )}

              {/* Icon */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full border-4 flex items-center justify-center z-10 ${
                  status === "completed"
                    ? "bg-[#476A55] border-[#476A55] text-white"
                    : status === "current"
                    ? "bg-accent border-accent text-white animate-pulse"
                    : "bg-white border-surface text-foreground-secondary"
                }`}
              >
                {status === "completed" ? (
                  <Check className="w-6 h-6" />
                ) : status === "current" ? (
                  <PlayCircle className="w-6 h-6" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <h3
                  className={`font-serif text-xl font-semibold mb-2 ${
                    status === "current" ? "text-accent" : ""
                  }`}
                >
                  {stage.title}
                </h3>
                <p className="text-sm text-foreground-secondary mb-2">
                  {stage.description}
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded-sm text-xs font-medium ${getLevelColor(
                    stage.level
                  )}`}
                >
                  {stage.level}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-12 flex flex-wrap gap-6 justify-center text-sm text-foreground-secondary">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#476A55] text-white flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <span>Đã hoàn thành</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center">
            <PlayCircle className="w-4 h-4" />
          </div>
          <span>Đang học</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white border-2 border-surface text-foreground-secondary flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <span>Sắp tới</span>
        </div>
      </div>
    </div>
  );
}
