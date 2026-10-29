export interface CommandSuggestion {
  command: string;
  description?: string;
}

export interface CommandPromptBarProps {
  promptLabel?: string;
  placeholder?: string;
  onExecute: (command: string) => void;
  suggestions?: CommandSuggestion[];
  recentHistory?: string[];
  statusText?: string;
  className?: string;
}
