import React, { useRef, useEffect, useCallback } from 'react';
import { ArrowUp, Square, Paperclip, Mic, X, FileText, Image as ImageIcon } from 'lucide-react';
import { PromptInputProps, PromptAttachment } from './types';

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onSubmit,
  onStop,
  isGenerating = false,
  placeholder = 'Ask anything...',
  disabled = false,
  minRows = 1,
  maxRows = 8,
  attachments = [],
  onRemoveAttachment,
  onAttachFiles,
  chips = [],
  modelSelectorSlot,
  leadingActions,
  trailingActions,
  allowVoice = false,
  isRecording = false,
  onToggleVoice,
  className = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const computedLineHeight = 24;
    const minHeight = minRows * computedLineHeight;
    const maxHeight = maxRows * computedLineHeight;
    const scrollHeight = textarea.scrollHeight;

    const nextHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [value, minRows, maxRows]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating && onStop) {
        onStop();
      } else if (value.trim().length > 0 || attachments.length > 0) {
        onSubmit(value);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onAttachFiles) {
      onAttachFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const canSubmit = (value.trim().length > 0 || attachments.length > 0) && !disabled;

  return (
    <div
      className={`relative flex flex-col w-full rounded-2xl border border-border bg-card shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 ${className}`}
    >
      {/* Hidden file input */}
      {onAttachFiles && (
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      )}

      {/* Attachments & Chips list */}
      {(attachments.length > 0 || chips.length > 0) && (
        <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1">
          {chips.map((chip) => (
            <span
              key={chip.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground border border-border"
            >
              {chip.icon}
              <span>{chip.label}</span>
              {chip.onRemove && (
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Remove chip ${chip.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}

          {attachments.map((att) => (
            <span
              key={att.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-muted text-foreground border border-border"
            >
              {att.type === 'image' ? (
                <ImageIcon className="w-3.5 h-3.5 text-primary" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <span className="truncate max-w-[150px]">{att.name}</span>
              {att.size && <span className="text-[10px] text-muted-foreground">({att.size})</span>}
              {onRemoveAttachment && (
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(att.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors ml-0.5"
                  aria-label={`Remove attachment ${att.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Main Text Input Area */}
      <div className="px-4 pt-3 pb-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={minRows}
          className="w-full resize-none border-0 bg-transparent p-0 text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:opacity-50"
        />
      </div>

      {/* Toolbar / Actions Footer */}
      <div className="flex items-center justify-between px-3 pb-3 pt-1">
        <div className="flex items-center gap-1.5">
          {onAttachFiles && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors disabled:opacity-40"
              title="Attach files"
              aria-label="Attach files"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          )}

          {allowVoice && onToggleVoice && (
            <button
              type="button"
              onClick={onToggleVoice}
              disabled={disabled}
              className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                isRecording
                  ? 'bg-destructive/10 text-destructive animate-pulse'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
              title={isRecording ? 'Stop recording' : 'Voice input'}
              aria-label={isRecording ? 'Stop recording' : 'Voice input'}
            >
              <Mic className="w-4 h-4" />
            </button>
          )}

          {modelSelectorSlot}
          {leadingActions}
        </div>

        <div className="flex items-center gap-2">
          {trailingActions}

          {isGenerating ? (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-all shadow-sm"
              title="Stop generation"
              aria-label="Stop generation"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSubmit(value)}
              disabled={!canSubmit}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all shadow-sm ${
                canSubmit
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground/40 cursor-not-allowed'
              }`}
              title="Send message (Enter)"
              aria-label="Send message"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
