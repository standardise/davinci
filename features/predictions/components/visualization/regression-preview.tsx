interface RegressionPreviewProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
}

export function RegressionPreview({
  value,
  min = 0,
  max = 100,
  label = "Predicted Value",
  unit = "",
}: RegressionPreviewProps) {
  
  // Safe calculation for percentage
  const safeMin = Math.min(min, value);
  const safeMax = Math.max(max, value);
  const range = safeMax - safeMin;
  
  const percentage = range === 0 
    ? 50 
    : Math.min(100, Math.max(0, ((value - safeMin) / range) * 100));

  return (
    <div className="w-full flex flex-col items-center justify-center py-1">
      {/* Label */}
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-bold">
        {label}
      </span>

      {/* Main Number */}
      <div className="text-2xl font-bold font-mono tracking-tight text-foreground flex items-baseline">
        <span className="text-sm text-muted-foreground mr-1">
          {unit}
        </span>
        {value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>

      {/* Range Slider Visualization */}
      <div className="w-full mt-3 relative h-6">
        {/* Track */}
        <div className="absolute top-1/2 left-0 w-full h-1.5 bg-secondary rounded-full -translate-y-1/2"></div>

        {/* Active Fill */}
        <div
          className="absolute top-1/2 left-0 h-1.5 bg-primary/30 rounded-l-full -translate-y-1/2 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>

        {/* Marker Thumb */}
        <div
          className="absolute top-1/2 w-4 h-4 bg-primary border-2 border-background rounded-full shadow-md -translate-y-1/2 transition-all duration-500 flex items-center justify-center"
          style={{ left: `${percentage}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className="w-1 h-1 bg-background rounded-full" />
        </div>

        {/* Min/Max Labels */}
        <div className="absolute top-full left-0 w-full flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
          <span>{safeMin < 1000 ? safeMin : `${(safeMin / 1000).toFixed(1)}k`}</span>
          <span>{safeMax < 1000 ? safeMax : `${(safeMax / 1000).toFixed(1)}k`}</span>
        </div>
      </div>
    </div>
  );
}