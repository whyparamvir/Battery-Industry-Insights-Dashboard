import { useState } from 'react';
import { Battery, BarChart3, Table2, GitCompareArrows, Trophy, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SummaryStats from './components/SummaryStats';
import DashboardCharts from './components/DashboardCharts';
import CompanyTable from './components/CompanyTable';
import TechComparison from './components/TechComparison';
import Leaderboard from './components/Leaderboard';

type Tab = 'overview' | 'rankings' | 'data' | 'compare';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'overview', label: 'Overview & Charts', icon: BarChart3 },
    { key: 'rankings', label: 'Leaderboards', icon: Trophy },
    { key: 'data', label: 'Full Data Table', icon: Table2 },
    { key: 'compare', label: 'Compare', icon: GitCompareArrows },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Battery className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">Battery Manufacturing Dashboard</h1>
                <p className="text-xs text-muted-foreground">Top 100 Global Battery Companies 2024-2025</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {tabs.map(tab => (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.key)}
                  className="gap-1.5"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
            {tabs.map(tab => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => { setActiveTab(tab.key); setMobileMenuOpen(false); }}
                className="w-full justify-start gap-2"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Summary Stats - always visible */}
        <SummaryStats />

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <DashboardCharts />
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">About This Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                <div>
                  <p className="mb-3">
                    This dashboard compiles data on the top 100 battery manufacturing companies worldwide,
                    based on 2024-2025 SNE Research, company annual reports, and industry analysis.
                  </p>
                  <p>
                    The global EV battery market reached <strong className="text-foreground">1,187 GWh in 2025</strong>,
                    up 31.7% from 2024. Chinese firms dominate with <strong className="text-foreground">six of the top ten spots</strong>,
                    commanding a 70.4% combined market share.
                  </p>
                </div>
                <div>
                  <p className="mb-3">
                    Key metrics include market share, production capacity (GWh), revenue, R&D investment,
                    battery chemistry types, energy density, and year-over-year growth rates.
                  </p>
                  <p>
                    The industry is rapidly evolving with new technologies like <strong className="text-foreground">solid-state batteries</strong>,
                    <strong className="text-foreground"> silicon-anode cells</strong>, and <strong className="text-foreground">sodium-ion batteries</strong>
                    {' '}entering commercialization in 2025-2026.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rankings' && <Leaderboard />}

        {activeTab === 'data' && <CompanyTable />}

        {activeTab === 'compare' && <TechComparison />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>
              Data Sources: SNE Research 2025, Company Annual Reports, BloombergNEF, IEA, Industry Analysis
            </div>
            <div>
              Last Updated: June 2025 | 100 Companies | 20+ Countries
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
