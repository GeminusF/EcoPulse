interface Props {
  type?: 'actual' | 'mixed' | 'predicted';
}

export default function PredictedBadge({ type = 'predicted' }: Props) {
  if (type === 'actual') return null;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
      type === 'predicted'
        ? 'bg-[rgba(168,85,247,0.15)] text-[#A855F7]'
        : 'bg-[rgba(251,191,36,0.15)] text-[#FBBF24]'
    }`}>
      <span className="text-[9px]">🤖</span>
      {type === 'predicted' ? 'AI Predicted' : 'Partial'}
    </span>
  );
}
