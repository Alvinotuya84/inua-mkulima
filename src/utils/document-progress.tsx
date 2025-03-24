export const calculateOverallProgress = (status: string, progress: number) => {
  // Each stage represents a percentage of the total process
  const stages = {
    uploading: { start: 0, end: 20 }, // 0-20%
    storing: { start: 20, end: 40 }, // 20-40%
    processing: { start: 40, end: 90 }, // 40-90%
    completed: { start: 90, end: 100 }, // 90-100%
  } as const;

  if (status === "completed") return 100;
  if (status === "failed") return progress;

  const currentStage = stages[status as keyof typeof stages];
  if (!currentStage) return 0;

  // Calculate progress within the current stage
  const stageProgress =
    (progress / 100) * (currentStage.end - currentStage.start);
  return Math.min(currentStage.start + stageProgress, currentStage.end);
};
