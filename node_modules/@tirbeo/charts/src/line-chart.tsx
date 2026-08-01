"use client";

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface LineChartProps {
  data: Record<string, unknown>[];
  lines: { key: string; color?: string; name?: string }[];
  xKey?: string;
  height?: number;
}

export function LineChart({ data, lines, xKey = 'name', height = 300 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-admin-border)" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: 'var(--color-admin-text-muted)' }} />
        <YAxis tick={{ fontSize: 12, fill: 'var(--color-admin-text-muted)' }} />
        <Tooltip />
        {lines.map(line => (
          <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color || 'var(--color-primary)'} name={line.name || line.key} />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
