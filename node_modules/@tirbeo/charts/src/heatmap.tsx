'use client';

export interface HeatmapProps {
  data: { x: string; y: string; value: number }[];
  height?: number;
}

export function Heatmap({ data, height = 200 }: HeatmapProps) {
  if (!data.length) return null;
  const maxVal = Math.max(...data.map(d => d.value));
  const xLabels = [...new Set(data.map(d => d.x))];
  const yLabels = [...new Set(data.map(d => d.y))];

  return (
    <div className="overflow-x-auto" style={{ height }}>
      <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${xLabels.length}, 1fr)` }}>
        <div />
        {xLabels.map(x => (
          <div key={x} className="text-xs text-[var(--color-admin-text-muted)] text-center py-1">{x}</div>
        ))}
        {yLabels.map(y => (
          <>
            <div key={y} className="text-xs text-[var(--color-admin-text-muted)] pr-2 py-1">{y}</div>
            {xLabels.map(x => {
              const cell = data.find(d => d.x === x && d.y === y);
              const intensity = cell ? (cell.value / maxVal) * 100 : 0;
              return (
                <div
                  key={`${x}-${y}`}
                  className="rounded"
                  style={{
                    background: `var(--color-primary)`,
                    opacity: intensity / 100,
                    minHeight: 24,
                  }}
                  title={cell ? `${cell.value}` : '0'}
                />
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
