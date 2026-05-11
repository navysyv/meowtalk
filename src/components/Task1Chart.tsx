import type { ChartKind } from "@/data/writingPrompts";

interface Props {
  kind: ChartKind;
  promptId: string;
}

// Lightweight inline-SVG charts so no chart library is needed.
const Task1Chart = ({ kind, promptId }: Props) => {
  if (kind === "bar") {
    // 3 countries × 3 device types, 2010 vs 2023 (2023 only shown for clarity)
    const data = [
      { country: "UK", smartphone: 92, laptop: 78, tv: 60 },
      { country: "Brazil", smartphone: 80, laptop: 55, tv: 35 },
      { country: "Japan", smartphone: 88, laptop: 70, tv: 65 },
    ];
    const colors = ["hsl(265 70% 70%)", "hsl(220 60% 65%)", "hsl(180 50% 55%)"];
    return (
      <svg viewBox="0 0 360 200" className="w-full h-auto bg-background rounded-xl p-2" role="img" aria-label="Bar chart">
        <text x="180" y="14" textAnchor="middle" className="fill-foreground" fontSize="11" fontWeight="600">Device ownership 2023 (%)</text>
        {data.map((d, i) => {
          const x = 30 + i * 110;
          return (
            <g key={d.country}>
              <rect x={x} y={170 - d.smartphone * 1.4} width="22" height={d.smartphone * 1.4} fill={colors[0]} />
              <rect x={x + 26} y={170 - d.laptop * 1.4} width="22" height={d.laptop * 1.4} fill={colors[1]} />
              <rect x={x + 52} y={170 - d.tv * 1.4} width="22" height={d.tv * 1.4} fill={colors[2]} />
              <text x={x + 37} y={185} textAnchor="middle" className="fill-muted-foreground" fontSize="10">{d.country}</text>
            </g>
          );
        })}
        <g fontSize="9" className="fill-muted-foreground">
          <rect x="20" y="195" width="10" height="6" fill={colors[0]} /><text x="34" y="200">Smartphone</text>
          <rect x="120" y="195" width="10" height="6" fill={colors[1]} /><text x="134" y="200">Laptop</text>
          <rect x="200" y="195" width="10" height="6" fill={colors[2]} /><text x="214" y="200">Smart TV</text>
        </g>
      </svg>
    );
  }

  if (kind === "pie") {
    const slices = [
      { label: "Gas", value: 35, color: "hsl(265 70% 70%)" },
      { label: "Wind", value: 25, color: "hsl(180 50% 55%)" },
      { label: "Nuclear", value: 20, color: "hsl(220 60% 65%)" },
      { label: "Solar", value: 12, color: "hsl(45 85% 65%)" },
      { label: "Hydro", value: 8, color: "hsl(150 50% 55%)" },
    ];
    let cum = 0;
    const cx = 90, cy = 90, r = 70;
    return (
      <svg viewBox="0 0 320 200" className="w-full h-auto bg-background rounded-xl p-2" role="img" aria-label="Pie chart">
        <text x="160" y="14" textAnchor="middle" className="fill-foreground" fontSize="11" fontWeight="600">Electricity generation by source, 2023</text>
        {slices.map((s) => {
          const start = (cum / 100) * Math.PI * 2 - Math.PI / 2;
          cum += s.value;
          const end = (cum / 100) * Math.PI * 2 - Math.PI / 2;
          const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
          const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
          const large = s.value > 50 ? 1 : 0;
          return <path key={s.label} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`} fill={s.color} />;
        })}
        <g fontSize="10" className="fill-foreground">
          {slices.map((s, i) => (
            <g key={s.label} transform={`translate(195, ${40 + i * 22})`}>
              <rect width="12" height="12" fill={s.color} />
              <text x="18" y="10">{s.label} – {s.value}%</text>
            </g>
          ))}
        </g>
      </svg>
    );
  }

  if (kind === "line") {
    const points = [
      [1980, 13.2], [1990, 13.6], [2000, 14.1], [2010, 14.7], [2020, 15.4],
    ];
    const minY = 12.5, maxY = 16;
    const x = (year: number) => 40 + ((year - 1980) / 40) * 280;
    const y = (t: number) => 170 - ((t - minY) / (maxY - minY)) * 140;
    const path = points.map((p, i) => `${i ? "L" : "M"}${x(p[0])},${y(p[1])}`).join(" ");
    return (
      <svg viewBox="0 0 360 200" className="w-full h-auto bg-background rounded-xl p-2" role="img" aria-label="Line chart">
        <text x="180" y="14" textAnchor="middle" className="fill-foreground" fontSize="11" fontWeight="600">Average annual temperature (°C)</text>
        <line x1="40" y1="170" x2="330" y2="170" stroke="hsl(0 0% 60%)" strokeWidth="0.5" />
        <line x1="40" y1="30" x2="40" y2="170" stroke="hsl(0 0% 60%)" strokeWidth="0.5" />
        <path d={path} fill="none" stroke="hsl(265 70% 70%)" strokeWidth="2.5" />
        {points.map((p) => (
          <g key={p[0]}>
            <circle cx={x(p[0])} cy={y(p[1])} r="3" fill="hsl(265 70% 60%)" />
            <text x={x(p[0])} y={185} textAnchor="middle" fontSize="9" className="fill-muted-foreground">{p[0]}</text>
            <text x={x(p[0])} y={y(p[1]) - 8} textAnchor="middle" fontSize="9" className="fill-foreground">{p[1]}</text>
          </g>
        ))}
      </svg>
    );
  }

  // table
  const rows = [
    { country: "France", v: [77, 76, 41] },
    { country: "Spain", v: [47, 53, 36] },
    { country: "USA", v: [51, 60, 19] },
    { country: "Thailand", v: [10, 16, 6] },
  ];
  return (
    <div className="bg-background rounded-xl p-3 overflow-x-auto">
      <p className="text-xs font-semibold text-foreground mb-2 text-center">International tourist arrivals (millions)</p>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-1 px-2">Country</th><th className="py-1 px-2">2000</th><th className="py-1 px-2">2010</th><th className="py-1 px-2">2020</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.country} className="border-b border-border/40">
              <td className="py-1 px-2 font-medium text-foreground">{r.country}</td>
              {r.v.map((n, i) => <td key={i} className="py-1 px-2 text-center text-foreground">{n}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Task1Chart;
