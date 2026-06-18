import { useMemo, useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { batteryCompanies, regionColors } from '../data/batteryData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#84CC16', '#6366F1'];

export default function DashboardCharts() {
  const [topN, setTopN] = useState(15);

  const topCompanies = useMemo(() =>
    [...batteryCompanies].sort((a, b) => b.installations2025_GWh - a.installations2025_GWh).slice(0, topN),
    [topN]
  );

  const regionData = useMemo(() => {
    const grouped: Record<string, number> = {};
    batteryCompanies.forEach(c => {
      grouped[c.region] = (grouped[c.region] || 0) + c.installations2025_GWh;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }));
  }, []);

  const countryData = useMemo(() => {
    const grouped: Record<string, number> = {};
    batteryCompanies.forEach(c => {
      grouped[c.country] = (grouped[c.country] || 0) + c.installations2025_GWh;
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, []);

  const scatterData = useMemo(() =>
    batteryCompanies
      .filter(c => c.revenue2024_USD_B > 0 && c.installations2025_GWh > 0)
      .map(c => ({
        name: c.name,
        revenue: c.revenue2024_USD_B,
        capacity: c.installations2025_GWh,
        rd: c.rdSpend2024_USD_M,
        growth: c.growthRate_YoY,
        region: c.region,
        employees: c.employees,
      })),
    []
  );

  const radarData = useMemo(() => {
    const top5 = batteryCompanies.slice(0, 5);
    const metrics = ['Market Share', 'Growth', 'R&D/Rev', 'Energy Density', 'Capacity'];
    return metrics.map(metric => {
      const entry: Record<string, string | number> = { metric };
      top5.forEach(c => {
        switch (metric) {
          case 'Market Share': entry[c.name] = c.marketShare2025; break;
          case 'Growth': entry[c.name] = Math.min(Math.max(c.growthRate_YoY, 0), 100); break;
          case 'R&D/Rev': entry[c.name] = (c.rdSpend2024_USD_M / 1000 / c.revenue2024_USD_B) * 100; break;
          case 'Energy Density': entry[c.name] = (c.energyDensity_Wh_kg / 350) * 100; break;
          case 'Capacity': entry[c.name] = (c.installations2025_GWh / 500) * 100; break;
        }
      });
      return entry;
    });
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-sm text-muted-foreground">
              {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg max-w-xs">
          <p className="font-semibold text-foreground">{d.name}</p>
          <p className="text-sm text-muted-foreground">Revenue: ${d.revenue}B</p>
          <p className="text-sm text-muted-foreground">Capacity: {d.capacity} GWh</p>
          <p className="text-sm text-muted-foreground">R&D: ${d.rd}M</p>
          <p className="text-sm text-muted-foreground">Growth: {d.growth}%</p>
          <p className="text-sm text-muted-foreground">Region: {d.region}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Market Analytics</h2>
        <div className="flex gap-2">
          {[10, 15, 20, 50].map(n => (
            <button
              key={n}
              onClick={() => setTopN(n)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                topN === n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Top {n}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="bar">Top Companies</TabsTrigger>
          <TabsTrigger value="region">By Region</TabsTrigger>
          <TabsTrigger value="country">By Country</TabsTrigger>
          <TabsTrigger value="scatter">Revenue vs Capacity</TabsTrigger>
          <TabsTrigger value="radar">Compare Top 5</TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="mt-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">2025 Battery Installations (GWh)</h3>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={topCompanies} layout="vertical" margin={{ left: 100, right: 30, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--foreground))" width={95} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="installations2025_GWh" name="2025 Installations (GWh)" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="productionCapacity_GWh" name="Production Capacity (GWh)" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="region" className="mt-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Market Share by Region (GWh)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  innerRadius={70}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {regionData.map((entry, index) => (
                    <Cell key={index} fill={regionColors[entry.name] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="country" className="mt-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Top 10 Countries by Production</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={countryData} margin={{ left: 30, right: 30, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" angle={-30} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Installations (GWh)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="scatter" className="mt-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue vs Production Capacity (Bubble = R&D)</h3>
            <ResponsiveContainer width="100%" height={450}>
              <ScatterChart margin={{ left: 30, right: 30, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" dataKey="revenue" name="Revenue" unit="B" stroke="hsl(var(--muted-foreground))" />
                <YAxis type="number" dataKey="capacity" name="Capacity" unit=" GWh" stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<ScatterTooltip />} />
                <Legend />
                {Object.entries(regionColors).map(([region, color]) => (
                  <Scatter
                    key={region}
                    name={region}
                    data={scatterData.filter(d => d.region === region)}
                    fill={color}
                    opacity={0.7}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="radar" className="mt-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Top 5 Companies - Normalized Comparison</h3>
            <ResponsiveContainer width="100%" height={450}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="metric" stroke="hsl(var(--foreground))" />
                <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                {batteryCompanies.slice(0, 5).map((c, i) => (
                  <Radar
                    key={c.name}
                    name={c.name}
                    dataKey={c.name}
                    stroke={COLORS[i]}
                    fill={COLORS[i]}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                ))}
                <Legend />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
