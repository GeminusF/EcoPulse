import { useRef } from 'react';
import { Download } from 'lucide-react';
import { exportChartAsPng } from '../../utils/exportPdf';

interface Props { title?: string; }

export default function ChartActions({ title = 'chart' }: Props) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = () => {
    // Find the closest .card ancestor
    const card = parentRef.current?.closest('.card') as HTMLElement;
    if (card) exportChartAsPng(card, `ecopulse-${title}`);
  };

  return (
    <div ref={parentRef} className="flex items-center gap-0.5">
      <button
        onClick={handleDownload}
        className="p-1.5 rounded-md hover:bg-surface-2 transition-colors border-none bg-transparent cursor-pointer"
        title="Download as PNG"
        aria-label="Download chart as PNG"
      >
        <Download size={12} className="text-text-muted" />
      </button>
    </div>
  );
}
