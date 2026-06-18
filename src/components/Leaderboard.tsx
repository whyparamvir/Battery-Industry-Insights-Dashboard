import { useState, useMemo } from 'react';
import { batteryCompanies, type SortKey } from '../data/batteryData';
import { Trophy, TrendingUp, TrendingDown, Zap, DollarSign, FlaskConical, Users, Calendar, ChevronUp, Minus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface RankingItem {
  rank: number;
  name: string;
  country: string;
  value: number;
  unit: string;
  subValue?: string;
  change?: number;
}

export default function Leaderboard() {
  const [category, setCategory] = useState<SortKey>('installations2025_GWh');

  const categories: { key: SortKey; label: string; icon: any; unit: string }[] = [
    { key: 'installations2025_GWh', label: '2025 Installations', icon: Zap, unit: 'GWh' },
    { key: 'marketShare2025', label: 'Market Share', icon: Trophy, unit: '%' },
    { key: 'revenue2024_USD_B', label: 'Revenue (2024)', icon: DollarSign, unit: '$B' },
    { key: 'productionCapacity_GWh', label: 'Production Capacity', icon: Zap, unit: 'GWh' },
    { key: 'rdSpend2024_USD_M', label: 'R&D Investment', icon: FlaskConical, unit: '$M' },
    { key: 'energyDensity_Wh_kg', label: 'Energy Density', icon: Zap, unit: 'Wh/kg' },
    { key: 'growthRate_YoY', label: 'Growth Rate', icon: TrendingUp, unit: '%' },
    { key: 'employees', label: 'Workforce Size', icon: Users, unit: '' },
    { key: 'founded', label: 'Oldest Companies', icon: Calendar, unit: '' },
  ];

  const currentCat = categories.find(c => c.key === category)!;

  const rankings: RankingItem[] = useMemo(() => {
    const sorted = [...batteryCompanies]
      .filter(c => {
        const val = c[category];
        return typeof val === 'number' && val > 0;
      })
      .sort((a, b) => {
        const aVal = a[category] as number;
        const bVal = b[category] as number;
        return category === 'founded' ? aVal - bVal : bVal - aVal;
      })
      .slice(0, 20)
      .map((c, i) => ({
        rank: i + 1,
        name: c.name,
        country: c.country,
        value: c[category] as number,
        unit: currentCat.unit,
        subValue: c.primaryChemistry.slice(0, 2).join(', '),
        change: c.growthRate_YoY,
      }));
    return sorted;
  }, [category, currentCat.unit]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-600 flex items-center justify-center font-bold text-sm">1</div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-full bg-gray-300/30 text-gray-500 flex items-center justify-center font-bold text-sm">2</div>;
    if (rank === 3) return <div className="w-8 h-8 rounded-full bg-orange-600/20 text-orange-600 flex items-center justify-center font-bold text-sm">3</div>;
    return <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-medium text-sm">{rank}</div>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Leaderboards</h2>
      </div>

      <Tabs value={category} onValueChange={v => setCategory(v as SortKey)}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {categories.map(cat => (
            <TabsTrigger key={cat.key} value={cat.key} className="flex items-center gap-1.5 text-xs">
              <cat.icon className="w-3.5 h-3.5" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={category} className="mt-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <currentCat.icon className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">{currentCat.label} Rankings</span>
              </div>
              <Badge variant="outline">Top 20</Badge>
            </div>
            <div className="divide-y divide-border">
              {rankings.map((item) => (
                <div key={item.rank} className="flex items-center gap-4 px-6 py-3 hover:bg-muted/20 transition-colors">
                  <div className="flex-shrink-0">{getRankIcon(item.rank)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground truncate">{item.name}</span>
                      <Badge variant="outline" className="text-xs flex-shrink-0">{item.country}</Badge>
                    </div>
                    {item.subValue && (
                      <div className="text-xs text-muted-foreground mt-0.5">{item.subValue}</div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-foreground">
                      {typeof item.value === 'number' ? item.value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : item.value}
                      <span className="text-sm font-normal text-muted-foreground ml-1">{item.unit}</span>
                    </div>
                    {item.change !== undefined && (
                      <div className={`flex items-center justify-end gap-1 text-xs ${item.change > 0 ? 'text-green-600' : item.change < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {item.change > 0 ? <ChevronUp className="w-3 h-3" /> : item.change < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        {item.change > 0 ? '+' : ''}{item.change.toFixed(0)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
