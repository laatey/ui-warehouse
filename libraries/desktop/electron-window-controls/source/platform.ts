import { PlatformOS } from './types'

export const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPod|iPad/.test(navigator.userAgent)

export const isWindows =
  typeof navigator !== 'undefined' && /Win/.test(navigator.userAgent)

export const currentPlatform: PlatformOS = isMac
  ? 'darwin'
  : isWindows
    ? 'win32'
    : 'linux'

/** Space (px) reserved on the left for macOS traffic lights (close, minimize, zoom) */
export const WINDOW_CONTROLS_LEFT_PX = isMac ? 78 : 0

/** Space (px) reserved on the right for Windows/Linux title bar controls */
export const WINDOW_CONTROLS_RIGHT_PX = isMac ? 0 : 138
