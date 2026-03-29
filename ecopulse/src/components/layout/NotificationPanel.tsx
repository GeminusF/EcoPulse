import { useTranslation } from 'react-i18next';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

interface Props { open: boolean; onClose: () => void; }

const typeColors: Record<string, string> = {
  info: '#3B82F6', success: '#22C55E', warning: '#F59E0B', milestone: '#A855F7',
};
const typeIcons: Record<string, string> = {
  info: 'ℹ️', success: '✅', warning: '⚠️', milestone: '🏆',
};

function timeAgo(ts: number): string {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationPanel({ open, onClose }: Props) {
  const { t } = useTranslation();
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();

  if (!open) return null;

  return (
    <div className="absolute right-0 top-12 w-[360px] max-h-[480px] bg-surface border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-accent" />
          <span className="text-sm font-bold text-text-primary">{t('topbar.notifications', 'Notifications')}</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold bg-accent text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="p-1.5 rounded-md hover:bg-surface-2 transition-colors border-none bg-transparent cursor-pointer" title="Mark all read">
              <Check size={14} className="text-text-muted" />
            </button>
          )}
          <button onClick={clearAll} className="p-1.5 rounded-md hover:bg-surface-2 transition-colors border-none bg-transparent cursor-pointer" title="Clear all">
            <Trash2 size={14} className="text-text-muted" />
          </button>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-surface-2 transition-colors border-none bg-transparent cursor-pointer">
            <X size={14} className="text-text-muted" />
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell size={32} className="text-text-muted opacity-30 mb-2" />
            <p className="text-sm text-text-muted">All caught up!</p>
            <p className="text-xs text-text-muted opacity-60">No notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex gap-3 px-4 py-3 border-b border-border cursor-pointer transition-colors hover:bg-surface-2 ${
                !n.read ? 'bg-[rgba(34,197,94,0.03)]' : ''
              }`}
              onClick={() => markRead(n.id)}
            >
              <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs"
                style={{ background: `${typeColors[n.type]}20` }}>
                {typeIcons[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-text-primary truncate">{n.title}</span>
                  {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
                </div>
                <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">{n.message}</p>
                <span className="text-[10px] text-text-muted opacity-60 mt-0.5 block">{timeAgo(n.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
