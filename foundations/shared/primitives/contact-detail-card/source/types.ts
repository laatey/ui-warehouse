import React from 'react';

export interface ContactAttributeItem {
  id: string;
  label: string;
  value: string;
  type?: 'text' | 'email' | 'phone' | 'link' | 'badge';
}

export interface ContactDetailCardProps {
  name: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  company?: string;
  location?: string;
  timezone?: string;
  attributes?: ContactAttributeItem[];
  actionsSlot?: React.ReactNode;
  notesSlot?: React.ReactNode;
  onEdit?: () => void;
  className?: string;
}
