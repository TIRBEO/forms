"use client";

import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface AreaChartProps {
  data: Record<string, unknown>[];
  areas: { key: string; color?: string; name?: string }[];
  xKey?: string;
  height?: number;
}

export function AreaChart({ data, areas, xKey = 'name', height = 300 }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-admin-border)" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: 'var(--color-admin-text-muted)' }} />
        <YAxis tick={{ fontSize: 12, fill: 'var(--color-admin-text-muted)' }} />
        <Tooltip />
        {areas.map(area => (
          <Area key={area.key} type="monotone" dataKey={area.key} stroke={area.color || 'var(--color-primary)'} fill={area.color || 'var(--color-primary)'} fillOpacity={0.3} name={area.name || area.key} />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
