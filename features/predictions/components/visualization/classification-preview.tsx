interface ClassificationPreviewProps {
  // Map of ClassName -> Probability (0-100 or 0.0-1.0)
  probabilities: Record<string, number>; 
}

export function ClassificationPreview({ probabilities }: ClassificationPreviewProps) {
  // Convert dict to array and sort by score descending
  const predictions = Object.entries(probabilities)
    .map(([label, score]) => ({
      label,
      score: score > 1 ? score / 100 : score, // Normalize to 0.0-1.0 if > 1
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="w-full space-y-3">
      {predictions.slice(0, 2).map((item, index) => (
        <div key={item.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span
              className={
                index === 0
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              }
            >
              {item.label}
            </span>
            <span className="font-mono text-muted-foreground">
              {(item.score * 100).toFixed(0)}%
            </span>
          </div>
          {/* Progress Bar Area */}
          <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                index === 0 ? "bg-primary" : "bg-muted-foreground/30"
              }`}
              style={{ width: `${item.score * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
