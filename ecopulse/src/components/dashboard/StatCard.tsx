import type { ReactNode } from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface StatCardProps {
  label: string;
  value: string;
  changeText: string;
  changePositive: boolean;
  sparklineData: { v: number }[];
  iconBg: string;
  iconColor: string;
  lineColor: string;
  icon: ReactNode;
  animationDelay?: number;
}

export default function StatCard({
  label, value, changeText, changePositive,
  sparklineData, iconBg, iconColor, lineColor, icon, animationDelay = 0,
}: StatCardProps) {
  return (
    <div className="card animate-fade-in" style={{ animationDelay: `${animationDelay}ms`, opacity: 0 }}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[13px] text-text-muted font-medium">{label}</p>
          <p className="text-2xl md:text-[28px] font-extrabold text-text-primary leading-tight mt-1">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
          style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
      </div>
      <div className="flex justify-between items-end mt-3">
        <span className={`text-[13px] ${changePositive ? 'text-positive' : 'text-danger'}`}>
          {changeText}
        </span>
        <div className="w-[100px] h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line type="monotone" dataKey="v" stroke={lineColor} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
