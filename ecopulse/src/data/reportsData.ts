export interface ReportTemplate {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  categoryKey: string;
  format: 'PDF' | 'JSON' | 'CSV';
  fileUrl: string;
}

export const reportTemplates: ReportTemplate[] = [
  { id: 'monthly', nameKey: 'reports.tpl.monthly.name', descriptionKey: 'reports.tpl.monthly.desc', icon: 'calendar', categoryKey: 'reports.cat.periodic', format: 'PDF', fileUrl: '/mocks/monthly_summary.pdf' },
  { id: 'sector', nameKey: 'reports.tpl.sector.name', descriptionKey: 'reports.tpl.sector.desc', icon: 'piechart', categoryKey: 'reports.cat.analysis', format: 'JSON', fileUrl: '/mocks/sector_analysis.json' },
  { id: 'regional', nameKey: 'reports.tpl.regional.name', descriptionKey: 'reports.tpl.regional.desc', icon: 'map', categoryKey: 'reports.cat.analysis', format: 'JSON', fileUrl: '/mocks/regional_data.json' },
  { id: 'annual', nameKey: 'reports.tpl.annual.name', descriptionKey: 'reports.tpl.annual.desc', icon: 'trending', categoryKey: 'reports.cat.periodic', format: 'CSV', fileUrl: '/mocks/annual_trend.csv' },
  { id: 'policy', nameKey: 'reports.tpl.policy.name', descriptionKey: 'reports.tpl.policy.desc', icon: 'shield', categoryKey: 'reports.cat.strategic', format: 'CSV', fileUrl: '/mocks/policy_impact.csv' },
];

export interface ReportHistoryItem {
  id: string;
  nameKey: string;
  generatedAt: string;
  format: 'PDF' | 'CSV' | 'JSON';
  size: string;
}

export const reportHistory: ReportHistoryItem[] = [
  { id: 'r1', nameKey: 'reports.history.r1', generatedAt: '2025-03-01T09:14:00Z', format: 'PDF', size: '2.4 MB' },
  { id: 'r2', nameKey: 'reports.history.r2', generatedAt: '2025-01-15T14:30:00Z', format: 'PDF', size: '5.1 MB' },
  { id: 'r3', nameKey: 'reports.history.r3', generatedAt: '2025-01-05T11:00:00Z', format: 'CSV', size: '340 KB' },
  { id: 'r4', nameKey: 'reports.history.r4', generatedAt: '2024-12-20T16:45:00Z', format: 'JSON', size: '128 KB' },
  { id: 'r5', nameKey: 'reports.history.r5', generatedAt: '2024-12-10T08:20:00Z', format: 'PDF', size: '3.8 MB' },
];
