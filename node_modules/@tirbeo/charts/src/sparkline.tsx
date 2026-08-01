"use client";

import { LineChart, Line, ResponsiveContainer } from 'recharts';

export interface SparklineProps {
  data: { value: number }[];
  color?: string;
  height?: number;
}

export function Sparkline({ data, color = 'var(--color-primary)', height = 60 }: SparklineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
