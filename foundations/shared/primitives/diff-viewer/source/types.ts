export type DiffLineType = 'ctx' | 'add' | 'del'

export interface DiffLine {
  type: DiffLineType
  text: string
  oldNo: number | null
  newNo: number | null
}

export interface DiffHunk {
  oldStart: number
  newStart: number
  lines: DiffLine[]
}

export interface FileDiffData {
  path: string
  action: 'create' | 'update' | 'delete'
  additions?: number
  deletions?: number
  hunks: DiffHunk[]
}

export interface DiffViewerProps {
  file: FileDiffData
  maxLines?: number
  className?: string
}
