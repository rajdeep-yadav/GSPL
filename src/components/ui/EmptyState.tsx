import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-10 text-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]/50 ${className}`}>
      <div className="w-14 h-14 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-color)] flex items-center justify-center mb-4 text-[var(--brand-orange)] shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-main)] mb-1 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-[var(--text-muted)] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="gspl-btn-primary text-xs uppercase tracking-wider px-4 py-2"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

