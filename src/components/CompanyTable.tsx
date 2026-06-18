import { useState, useMemo } from 'react';
import {
  ChevronUp, ChevronDown, ChevronsUpDown, Search,
  Filter, Download, ExternalLink
} from 'lucide-react';
import { batteryCompanies, type SortKey } from '../data/batteryData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SortDirection = 'asc' | 'desc';

export default function CompanyTable() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('rank2025');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [chemistryFilter, setChemistryFilter] = useState<string>('all');
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(0);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(0);
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-primary" /> : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
  };

  const filtered = useMemo(() => {
    let data = [...batteryCompanies];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.keyCustomers.some(k => k.toLowerCase().includes(q))
      );
    }

    if (regionFilter !== 'all') {
      data = data.filter(c => c.region === regionFilter);
    }

    if (chemistryFilter !== 'all') {
      data = data.filter(c => c.primaryChemistry.some(ch => ch.includes(chemistryFilter)));
    }

    data.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });

    return data;
  }, [search, sortKey, sortDir, regionFilter, chemistryFilter]);

  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const exportCSV = () => {
    const headers = ['Rank', 'Name', 'Country', 'Region', 'Market Share %', 'Installations GWh', 'Revenue $B', 'Capacity GWh', 'Chemistry', 'Growth %', 'R&D $M', 'Employees', 'Founded'];
    const rows = filtered.map(c => [
      c.rank2025, c.name, c.country, c.region, c.marketShare2025, c.installations2025_GWh,
      c.revenue2024_USD_B, c.productionCapacity_GWh, c.primaryChemistry.join(';'),
      c.growthRate_YoY, c.rdSpend2024_USD_M, c.employees, c.founded
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'battery-companies.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const regions = [...new Set(batteryCompanies.map(c => c.region))];
  const chemistries = [...new Set(batteryCompanies.flatMap(c => c.primaryChemistry.map(ch => ch.split(' ')[0].split('(')[0])))];

  const headerBtn = (label: string, key: SortKey) => (
    <button
      onClick={() => handleSort(key)}
      className="flex items-center gap-1 hover:text-primary transition-colors font-medium text-xs uppercase tracking-wider"
    >
      {label} {sortIcon(key)}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Company Rankings & Data</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search companies, countries, customers..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              className="pl-9 w-72"
            />
          </div>
          <Select value={regionFilter} onValueChange={v => { setRegionFilter(v); setPage(0); }}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Region" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={chemistryFilter} onValueChange={v => { setChemistryFilter(v); setPage(0); }}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Chemistry" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chemistries</SelectItem>
              {chemistries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left">{headerBtn('Rank', 'rank2025')}</th>
                <th className="px-4 py-3 text-left">{headerBtn('Company', 'name')}</th>
                <th className="px-4 py-3 text-left">{headerBtn('Country', 'country')}</th>
                <th className="px-4 py-3 text-left">{headerBtn('Region', 'region')}</th>
                <th className="px-4 py-3 text-right">{headerBtn('Mkt Share %', 'marketShare2025')}</th>
                <th className="px-4 py-3 text-right">{headerBtn('2025 GWh', 'installations2025_GWh')}</th>
                <th className="px-4 py-3 text-right">{headerBtn('Revenue $B', 'revenue2024_USD_B')}</th>
                <th className="px-4 py-3 text-right">{headerBtn('Cap GWh', 'productionCapacity_GWh')}</th>
                <th className="px-4 py-3 text-left">Chemistry</th>
                <th className="px-4 py-3 text-right">{headerBtn('Growth %', 'growthRate_YoY')}</th>
                <th className="px-4 py-3 text-right">{headerBtn('R&D $M', 'rdSpend2024_USD_M')}</th>
                <th className="px-4 py-3 text-right">{headerBtn('Employees', 'employees')}</th>
                <th className="px-4 py-3 text-center">Link</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-foreground">{company.rank2025}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{company.name}</div>
                    <div className="text-xs text-muted-foreground">Est. {company.founded}</div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{company.country}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">{company.region}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{company.marketShare2025.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{company.installations2025_GWh.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">${company.revenue2024_USD_B.toFixed(1)}B</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{company.productionCapacity_GWh}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {company.primaryChemistry.slice(0, 2).map(chem => (
                        <Badge key={chem} variant="secondary" className="text-xs">{chem}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono ${company.growthRate_YoY >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {company.growthRate_YoY > 0 ? '+' : ''}{company.growthRate_YoY.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">${company.rdSpend2024_USD_M}M</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{company.employees.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            Showing {paged.length} of {filtered.length} companies
          </div>
          <div className="flex items-center gap-4">
            <Select value={rowsPerPage.toString()} onValueChange={v => { setRowsPerPage(Number(v)); setPage(0); }}>
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 rows</SelectItem>
                <SelectItem value="20">20 rows</SelectItem>
                <SelectItem value="50">50 rows</SelectItem>
                <SelectItem value="100">100 rows</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setPage(0)} disabled={page === 0}>First</Button>
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>Prev</Button>
              <span className="px-3 py-1 text-sm text-muted-foreground">{page + 1} / {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>Next</Button>
              <Button variant="outline" size="sm" onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>Last</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
