import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  File,
  Search,
} from 'lucide-react';
import { FileTreeProps, DirectoryItem, FileItem, TreeNode, isDirectory } from './types';

function getFileIcon(filename: string): React.JSX.Element {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['ts', 'tsx', 'js', 'jsx', 'py', 'rs', 'go', 'html', 'css', 'json'].includes(ext || '')) {
    return <FileCode className="w-3.5 h-3.5 text-blue-500/80 shrink-0" />;
  }
  if (['md', 'txt', 'log'].includes(ext || '')) {
    return <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
  }
  return <File className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />;
}

export function FileTree({
  tree,
  activePath,
  onSelectFile,
  filterPlaceholder = 'Filter files...',
  showSearch = true,
  defaultExpandedPaths = [],
  className = '',
}: FileTreeProps): React.JSX.Element {
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(defaultExpandedPaths));

  const toggleFolder = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const renderNode = (node: TreeNode, depth = 0): React.ReactNode => {
    if (isDirectory(node)) {
      const isExpanded = expanded.has(node.path) || Boolean(filter.trim());
      return (
        <div key={node.path} className="flex flex-col">
          <button
            type="button"
            onClick={() => toggleFolder(node.path)}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            className="flex items-center gap-1.5 py-1 pr-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-sm transition-colors text-left select-none cursor-pointer w-full"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
            )}
            <span className="truncate font-medium">{node.name}</span>
          </button>

          {isExpanded && (
            <div className="flex flex-col">
              {node.children.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Leaf file node
    const isMatching = !filter.trim() || node.name.toLowerCase().includes(filter.toLowerCase().trim());
    if (!isMatching) return null;

    const isSelected = activePath === node.path;

    return (
      <button
        key={node.path}
        type="button"
        onClick={() => onSelectFile?.(node)}
        style={{ paddingLeft: `${depth * 12 + 24}px` }}
        className={`flex items-center gap-2 py-1 pr-2 text-xs rounded-sm transition-colors text-left select-none cursor-pointer w-full ${
          isSelected
            ? 'bg-accent text-foreground font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
        }`}
      >
        {getFileIcon(node.name)}
        <span className="truncate">{node.name}</span>
      </button>
    );
  };

  return (
    <div className={`flex flex-col h-full w-full bg-background select-none ${className}`}>
      {showSearch && (
        <div className="p-2 border-b border-border">
          <div className="flex items-center h-7 px-2 rounded-md bg-muted/60 text-xs gap-1.5 border border-transparent focus-within:border-border focus-within:bg-background">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={filterPlaceholder}
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 outline-none"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-1 py-1.5">
        {renderNode(tree)}
      </div>
    </div>
  );
}
