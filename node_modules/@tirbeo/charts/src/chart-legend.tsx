"use client";

export interface ChartLegendProps {
  items: Array<{ color: string; label: string }>;
  className?: string;
}

export function ChartLegend({ items, className }: ChartLegendProps) {
  return (
    <div className={className}>
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
          <span className="text-xs text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
