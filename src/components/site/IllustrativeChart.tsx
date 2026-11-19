import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { illustrativeSeries } from "@/lib/illustrative";

const SERIES = {
  gold: { name: "Gold", color: "var(--chart-gold)" },
  btc: { name: "Bitcoin", color: "var(--chart-btc)" },
  eth: { name: "Ethereum", color: "var(--chart-eth)" },
} as const;

type Key = keyof typeof SERIES;

export function IllustrativeChart({
  keys,
  height = 300,
  seed = 1,
  points = 40,
}: {
  keys: Key[];
  height?: number;
  seed?: number;
  points?: number;
}) {
  const data = illustrativeSeries(points, seed);
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            {keys.map((k) => (
              <linearGradient key={k} id={`fill-${k}-${seed}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SERIES[k].color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={SERIES[k].color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
          <XAxis dataKey="label" tick={false} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={["dataMin - 4", "dataMax + 4"]}
            tickFormatter={() => ""}
            width={24}
          />
          <Tooltip
            cursor={{ stroke: "var(--primary)", strokeOpacity: 0.4 }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              color: "var(--foreground)",
              fontSize: 12,
            }}
            labelFormatter={() => "Illustrative point"}
            formatter={(_v, name) => ["sample shape", name]}
          />
          {keys.map((k) => (
            <Area
              key={k}
              type="monotone"
              dataKey={k}
              name={SERIES[k].name}
              stroke={SERIES[k].color}
              strokeWidth={2}
              fill={`url(#fill-${k}-${seed})`}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartLegend({ keys }: { keys: Key[] }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      {keys.map((k) => (
        <span key={k} className="inline-flex items-center gap-2">
          <span className="h-0.5 w-5 rounded-full" style={{ background: SERIES[k].color }} />
          {SERIES[k].name}
        </span>
      ))}
    </div>
  );
}
