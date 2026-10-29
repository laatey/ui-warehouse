import React from 'react';

export interface FileItem {
  name: string;
  path: string;
  language?: string;
  size?: number;
}

export interface DirectoryItem {
  name: string;
  path: string;
  children: Array<DirectoryItem | FileItem>;
}

export type TreeNode = DirectoryItem | FileItem;

export const isDirectory = (node: TreeNode): node is DirectoryItem => {
  return (node as DirectoryItem).children !== undefined;
};

export interface FileTreeProps {
  tree: DirectoryItem;
  activePath?: string;
  onSelectFile?: (file: FileItem) => void;
  filterPlaceholder?: string;
  showSearch?: boolean;
  defaultExpandedPaths?: string[];
  className?: string;
}
