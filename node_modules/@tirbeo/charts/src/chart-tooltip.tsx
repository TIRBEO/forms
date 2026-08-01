"use client";

export interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  className?: string;
}

export function ChartTooltip({ active, payload, label, className }: ChartTooltipProps) {
  if (!active || !payload) return null;
  return (
    <div className={className}>
      <p className="text-xs font-medium text-gray-900">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}
