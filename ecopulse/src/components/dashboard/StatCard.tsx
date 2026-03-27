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
  label,
  value,
  changeText,
  changePositive,
  sparklineData,
  iconBg,
  iconColor,
  lineColor,
  icon,
  animationDelay = 0,
}: StatCardProps) {
  return (
    <div
      className="card animate-fade-in"
      style={{ animationDelay: `${animationDelay}ms`, opacity: 0 }}
    >
      {/* Row 1: Label + Icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {label}
          </p>
          <p
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              lineHeight: 1.1,
              marginTop: 4,
            }}
          >
            {value}
          </p>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Row 2: Change text + Sparkline */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 }}>
        <span
          style={{
            fontSize: 13,
            color: changePositive ? 'var(--color-positive)' : 'var(--color-danger)',
          }}
        >
          {changeText}
        </span>
        <div style={{ width: 100, height: 40 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={lineColor}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
