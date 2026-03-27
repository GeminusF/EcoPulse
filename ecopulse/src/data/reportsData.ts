export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export const reportTemplates: ReportTemplate[] = [
  { id: 'monthly', name: 'Monthly Emissions Summary', description: 'Overview of total and per-sector emissions for the selected month', icon: 'calendar', category: 'Periodic' },
  { id: 'sector', name: 'Sector-by-Sector Breakdown', description: 'Deep dive into Transport, Energy, and Industry emissions with trends', icon: 'piechart', category: 'Analysis' },
  { id: 'regional', name: 'Regional Comparison Report', description: 'Emissions data across all 10 economic regions of Azerbaijan', icon: 'map', category: 'Analysis' },
  { id: 'annual', name: 'Annual Trend Report', description: 'Year-over-year comparison with cumulative totals and projections', icon: 'trending', category: 'Periodic' },
  { id: 'policy', name: 'Policy Impact Assessment', description: 'Simulated outcomes of policy scenarios vs baseline trajectory', icon: 'shield', category: 'Strategic' },
];

export interface ReportHistoryItem {
  id: string;
  name: string;
  generatedAt: string;
  format: 'PDF' | 'CSV' | 'JSON';
  size: string;
}

export const reportHistory: ReportHistoryItem[] = [
  { id: 'r1', name: 'Monthly Emissions Summary — Feb 2025', generatedAt: '2025-03-01T09:14:00Z', format: 'PDF', size: '2.4 MB' },
  { id: 'r2', name: 'Annual Trend Report — 2024', generatedAt: '2025-01-15T14:30:00Z', format: 'PDF', size: '5.1 MB' },
  { id: 'r3', name: 'Sector Breakdown — Q4 2024', generatedAt: '2025-01-05T11:00:00Z', format: 'CSV', size: '340 KB' },
  { id: 'r4', name: 'Regional Comparison — 2024', generatedAt: '2024-12-20T16:45:00Z', format: 'JSON', size: '128 KB' },
  { id: 'r5', name: 'Policy Impact — Green Transport', generatedAt: '2024-12-10T08:20:00Z', format: 'PDF', size: '3.8 MB' },
];
