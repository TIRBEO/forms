# @tirbeo/charts

Tirbeo chart components and visualization primitives.

## Installation

```bash
pnpm add @tirbeo/charts
```

## Chart Types

| Component | Description |
|-----------|-------------|
| `LineChart` | Line chart for trends over time |
| `AreaChart` | Area chart for cumulative data |
| `BarChart` | Vertical bar chart |
| `HorizontalBarChart` | Horizontal bar chart |
| `GroupedBarChart` | Grouped bars for comparison |
| `StackedBarChart` | Stacked bars for composition |
| `DonutChart` | Donut chart for proportions |
| `PieChart` | Pie chart for parts of whole |
| `ScatterChart` | Scatter plot for correlations |
| `RadarChart` | Radar chart for multi-dimensional data |
| `Heatmap` | Heatmap for density data |
| `FunnelChart` | Funnel chart for conversion flows |
| `Sparkline` | Inline sparkline for small metrics |

## Data Format

Charts accept data as arrays of objects:

```tsx
const data = [
  { label: "Jan", value: 100 },
  { label: "Feb", value: 150 },
  { label: "Mar", value: 120 },
];

<LineChart data={data} xKey="label" yKey="value" />
```

## Chart Card

Wrap charts in `ChartCard` for consistent styling:

```tsx
<ChartCard title="User Growth" description="New users over time">
  <LineChart data={data} />
</ChartCard>
```

## Responsive Behavior

All charts are responsive and adapt to container width. They also support dark mode via `@tirbeo/theme`.

## Loading and Empty States

Charts support `loading` and `empty` states:

```tsx
<LineChart data={data} loading={isLoading} />
<LineChart data={[]} empty="No data available" />
```

## Accessibility

Charts include accessible labels, ARIA attributes, and keyboard navigation support.