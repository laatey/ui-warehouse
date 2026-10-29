import React from 'react';

export interface PromptAttachment {
  id: string;
  name: string;
  type?: 'image' | 'file' | 'code' | string;
  size?: string;
  url?: string;
}

export interface PromptChip {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onRemove?: () => void;
}

export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onStop?: () => void;
  isGenerating?: boolean;
  placeholder?: string;
  disabled?: boolean;
  minRows?: number;
  maxRows?: number;
  attachments?: PromptAttachment[];
  onRemoveAttachment?: (id: string) => void;
  onAttachFiles?: (files: FileList | null) => void;
  chips?: PromptChip[];
  modelSelectorSlot?: React.ReactNode;
  leadingActions?: React.ReactNode;
  trailingActions?: React.ReactNode;
  allowVoice?: boolean;
  isRecording?: boolean;
  onToggleVoice?: () => void;
  className?: string;
}
