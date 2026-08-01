'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export interface DonutChartProps {
  data: { name: string; value: number; color?: string }[];
  innerRadius?: number;
  outerRadius?: number;
  height?: number;
}

const DEFAULT_COLORS = ['var(--color-primary)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-error)', 'var(--color-info)'];

export function DonutChart({ data, innerRadius = 60, outerRadius = 100, height = 300 }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="value"
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
