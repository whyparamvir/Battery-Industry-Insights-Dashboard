import { Battery, Zap, TrendingUp, Globe, DollarSign, FlaskConical } from 'lucide-react';
import { batteryCompanies } from '../data/batteryData';

export default function SummaryStats() {
  const totalCapacity = batteryCompanies.reduce((sum, c) => sum + c.installations2025_GWh, 0);
  const totalRevenue = batteryCompanies.reduce((sum, c) => sum + c.revenue2024_USD_B, 0);
  const totalRnd = batteryCompanies.reduce((sum, c) => sum + c.rdSpend2024_USD_M, 0);
  const totalEmployees = batteryCompanies.reduce((sum, c) => sum + c.employees, 0);
  const avgGrowth = batteryCompanies.filter(c => c.growthRate_YoY > 0).reduce((sum, c) => sum + c.growthRate_YoY, 0) / batteryCompanies.filter(c => c.growthRate_YoY > 0).length;

  const stats = [
    { label: 'Total 2025 Installations', value: `${totalCapacity.toFixed(1)} GWh`, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Combined Revenue (2024)', value: `$${totalRevenue.toFixed(1)}B`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Total R&D Investment', value: `$${(totalRnd / 1000).toFixed(1)}B`, icon: FlaskConical, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Total Workforce', value: `${(totalEmployees / 1000).toFixed(0)}K+`, icon: Battery, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Avg Growth Rate', value: `${avgGrowth.toFixed(1)}%`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Countries Covered', value: '20+', icon: Globe, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow">
          <div className={`${stat.bg} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
