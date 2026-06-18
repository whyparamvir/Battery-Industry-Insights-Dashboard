import { useState, useMemo } from 'react';
import { batteryCompanies } from '../data/batteryData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, DollarSign, Users, FlaskConical, Battery } from 'lucide-react';

export default function TechComparison() {
  const [companyA, setCompanyA] = useState(1);
  const [companyB, setCompanyB] = useState(2);

  const a = batteryCompanies.find(c => c.id === companyA)!;
  const b = batteryCompanies.find(c => c.id === companyB)!;

  const topCompanies = useMemo(() =>
    batteryCompanies.filter(c => c.installations2025_GWh > 1 || c.marketCap_USD_B || c.funding_USD_B),
    []
  );

  const maxEnergyDensity = 450;
  const maxGrowth = 500;
  const maxRevenue = 120;
  const maxCapacity = 600;
  const maxRd = 7000;
  const maxEmployees = 800000;

  const compareItem = (label: string, aVal: number, bVal: number, max: number, unit: string, IconComp: React.ComponentType<{className?: string}> | null) => {
    const aPct = Math.min((aVal / max) * 100, 100);
    const bPct = Math.min((bVal / max) * 100, 100);
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {IconComp && <IconComp className="w-4 h-4" />}
          {label}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-foreground">{a.name}</span>
              <span className="text-foreground">{typeof aVal === 'number' ? aVal.toFixed(1) : aVal}{unit}</span>
            </div>
            <Progress value={aPct} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-foreground">{b.name}</span>
              <span className="text-foreground">{typeof bVal === 'number' ? bVal.toFixed(1) : bVal}{unit}</span>
            </div>
            <Progress value={bPct} className="h-2" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Head-to-Head Comparison</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Company A</label>
          <Select value={companyA.toString()} onValueChange={v => setCompanyA(Number(v))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-72">
              {topCompanies.map(c => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.rank2025}. {c.name} ({c.country})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Company B</label>
          <Select value={companyB.toString()} onValueChange={v => setCompanyB(Number(v))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-72">
              {topCompanies.map(c => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.rank2025}. {c.name} ({c.country})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6 pb-4 border-b border-border">
          <div>
            <h3 className="text-xl font-bold text-foreground">{a.name}</h3>
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="secondary">{a.country}</Badge>
              <Badge variant="outline">{a.region}</Badge>
              {a.primaryChemistry.map(c => <Badge key={c} variant="default" className="text-xs">{c}</Badge>)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">{a.batteryTypes.join(', ')}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{b.name}</h3>
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="secondary">{b.country}</Badge>
              <Badge variant="outline">{b.region}</Badge>
              {b.primaryChemistry.map(c => <Badge key={c} variant="default" className="text-xs">{c}</Badge>)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">{b.batteryTypes.join(', ')}</p>
          </div>
        </div>

        <div className="space-y-5">
          {compareItem('Energy Density (Wh/kg)', a.energyDensity_Wh_kg, b.energyDensity_Wh_kg, maxEnergyDensity, '', Zap)}
          {compareItem('Growth Rate (%)', a.growthRate_YoY, b.growthRate_YoY, maxGrowth, '%', TrendingUp)}
          {compareItem('Revenue 2024 ($B)', a.revenue2024_USD_B, b.revenue2024_USD_B, maxRevenue, 'B', DollarSign)}
          {compareItem('2025 Installations (GWh)', a.installations2025_GWh, b.installations2025_GWh, maxCapacity, ' GWh', Battery)}
          {compareItem('R&D Spend ($M)', a.rdSpend2024_USD_M, b.rdSpend2024_USD_M, maxRd, 'M', FlaskConical)}
          {compareItem('Employees', a.employees, b.employees, maxEmployees, '', Users)}
          {compareItem('Market Share (%)', a.marketShare2025, b.marketShare2025, 45, '%', Battery)}
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">Key Customers</div>
            <div className="flex flex-wrap gap-1">
              {a.keyCustomers.map(k => <Badge key={k} variant="outline" className="text-xs">{k}</Badge>)}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">Key Customers</div>
            <div className="flex flex-wrap gap-1">
              {b.keyCustomers.map(k => <Badge key={k} variant="outline" className="text-xs">{k}</Badge>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
