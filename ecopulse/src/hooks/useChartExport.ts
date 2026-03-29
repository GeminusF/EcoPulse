import { useRef, useCallback } from 'react';
import { exportChartAsPng } from '../utils/exportPdf';

export default function useChartExport() {
  const ref = useRef<HTMLDivElement>(null);

  const downloadPng = useCallback((filename = 'ecopulse-chart') => {
    if (ref.current) exportChartAsPng(ref.current, filename);
  }, []);

  return { ref, downloadPng };
}
