import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Edit2, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { ContactDetailCardProps } from './types';

export const ContactDetailCard: React.FC<ContactDetailCardProps> = ({
  name,
  avatarUrl,
  email,
  phone,
  company,
  location,
  timezone,
  attributes = [],
  actionsSlot,
  notesSlot,
  onEdit,
  className = '',
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [attributesOpen, setAttributesOpen] = useState(true);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <div className={`flex flex-col h-full w-full bg-card text-foreground select-none overflow-y-auto divide-y divide-border/50 ${className}`}>
      {/* 1. Header Profile Summary */}
      <div className="p-4 flex flex-col items-center text-center bg-muted/15">
        <div className="relative mb-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-16 h-16 rounded-full object-cover shadow-sm border border-border" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-secondary text-secondary-foreground font-bold text-xl flex items-center justify-center border border-border shadow-xs">
              {name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <h3 className="text-base font-semibold text-foreground truncate max-w-full">
          {name}
        </h3>
        {company && (
          <p className="text-xs text-muted-foreground truncate max-w-full mt-0.5">
            {company}
          </p>
        )}

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          {actionsSlot}
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="p-1.5 rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-xs flex items-center gap-1.5"
              title="Edit contact"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Primary Contact Details List */}
      <div className="p-4 space-y-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Contact Details
        </span>

        <div className="space-y-2.5 pt-1">
          {email && (
            <div className="flex items-center justify-between text-xs group">
              <div className="flex items-center gap-2 text-muted-foreground truncate">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="text-foreground truncate">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(email, 'email')}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-foreground transition-opacity"
                title="Copy email"
              >
                {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          )}

          {phone && (
            <div className="flex items-center justify-between text-xs group">
              <div className="flex items-center gap-2 text-muted-foreground truncate">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="text-foreground truncate">{phone}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(phone, 'phone')}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-foreground transition-opacity"
                title="Copy phone"
              >
                {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          )}

          {location && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="text-foreground truncate">{location}</span>
            </div>
          )}

          {timezone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="text-foreground truncate">{timezone}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Custom Attributes Section */}
      {attributes.length > 0 && (
        <div className="p-4">
          <button
            type="button"
            onClick={() => setAttributesOpen(!attributesOpen)}
            className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground mb-2"
          >
            <span>Attributes</span>
            {attributesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {attributesOpen && (
            <div className="space-y-2 pt-1">
              {attributes.map((attr) => (
                <div key={attr.id} className="flex items-center justify-between text-xs py-1 border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground">{attr.label}</span>
                  <span className="font-medium text-foreground truncate max-w-[150px]">{attr.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Notes Section Slot */}
      {notesSlot && (
        <div className="p-4 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Internal Notes
          </span>
          <div className="pt-1">
            {notesSlot}
          </div>
        </div>
      )}
    </div>
  );
};
