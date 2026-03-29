interface Props {
  label?: string;
}

export default function DataTimestamp({ label }: Props) {
  const ago = label ?? `Updated ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return (
    <span className="text-[10px] text-text-muted opacity-60 font-medium tracking-wide">
      {ago}
    </span>
  );
}
