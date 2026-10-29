import React from 'react';
import {
  AlertCircle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Minus,
  Calendar,
  User,
} from 'lucide-react';
import type { IssueRowItemProps, IssuePriorityLevel } from './types';

const PriorityIcon: React.FC<{ priority?: IssuePriorityLevel }> = ({ priority }) => {
  switch (priority) {
    case 'urgent':
      return <AlertCircle className="w-3.5 h-3.5 text-red-500" title="Urgent" />;
    case 'high':
      return <ArrowUp className="w-3.5 h-3.5 text-orange-500" title="High" />;
    case 'medium':
      return <ArrowRight className="w-3.5 h-3.5 text-yellow-500" title="Medium" />;
    case 'low':
      return <ArrowDown className="w-3.5 h-3.5 text-blue-500" title="Low" />;
    case 'none':
    default:
      return <Minus className="w-3.5 h-3.5 text-muted-foreground/60" title="None" />;
  }
};

export const IssueRowItem: React.FC<IssueRowItemProps> = ({
  identifier,
  title,
  state,
  priority = 'none',
  assignee,
  dueDate,
  labels = [],
  isSelected = false,
  onSelectChange,
  onClick,
  actionsSlot,
  children,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between gap-3 px-3 py-2 border-b border-border/60 bg-background hover:bg-muted/40 transition-colors text-xs select-none cursor-pointer ${
        isSelected ? 'bg-primary/5' : ''
      } ${className}`}
    >
      {/* Left section: Checkbox, Identifier, Priority, State, Title */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {onSelectChange && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectChange(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${identifier}`}
            className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer shrink-0"
          />
        )}

        {/* Priority Icon */}
        <div className="shrink-0 flex items-center">
          <PriorityIcon priority={priority} />
        </div>

        {/* Issue Identifier Tag */}
        <span className="font-mono text-[11px] font-semibold text-muted-foreground shrink-0 uppercase tracking-tight">
          {identifier}
        </span>

        {/* Issue State Badge */}
        {state && (
          <div className="flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded bg-muted text-[11px] text-muted-foreground font-medium">
            {state.color && (
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: state.color }}
              />
            )}
            {state.icon && <span className="w-3 h-3 shrink-0">{state.icon}</span>}
            <span className="truncate max-w-[80px]">{state.name}</span>
          </div>
        )}

        {/* Issue Title */}
        <span className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {title}
        </span>
      </div>

      {/* Middle Custom Slot (Blank by default per AGENTS.md) */}
      {children && <div className="flex items-center gap-1.5 shrink-0">{children}</div>}

      {/* Right section: Labels, Due Date, Assignee, Actions */}
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* Labels */}
        {labels.length > 0 && (
          <div className="hidden sm:flex items-center gap-1">
            {labels.map((label) => (
              <span
                key={label.id}
                className="px-1.5 py-0.5 rounded text-[10px] bg-muted/60 text-muted-foreground font-medium border border-border/50"
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* Due Date */}
        {dueDate && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
            <Calendar className="w-3 h-3" />
            <span>{dueDate}</span>
          </div>
        )}

        {/* Assignee Avatar / Indicator */}
        {assignee && (
          <div
            title={`Assigned to ${assignee.name}`}
            className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0"
          >
            {assignee.avatarUrl ? (
              <img src={assignee.avatarUrl} alt={assignee.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
        )}

        {/* Actions slot */}
        {actionsSlot && <div className="flex items-center">{actionsSlot}</div>}
      </div>
    </div>
  );
};
