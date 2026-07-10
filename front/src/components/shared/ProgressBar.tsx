interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  height?: number;
  showStripes?: boolean;
}

export function ProgressBar({
  value,
  color = "#1B3FA6",
  height = 8,
  showStripes = false,
}: ProgressBarProps) {
  const capped = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ background: "#E8ECF4", height }}
      role="progressbar"
      aria-valuenow={capped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full relative overflow-hidden transition-all duration-500"
        style={{
          width: `${capped}%`,
          background: `linear-gradient(90deg, ${color}CC, ${color})`,
        }}
      >
        {showStripes && (
          <div
            style={{
              position: "absolute", inset: 0,
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 8px)",
            }}
          />
        )}
      </div>
    </div>
  );
}
