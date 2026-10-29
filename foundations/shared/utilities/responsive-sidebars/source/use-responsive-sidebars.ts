import { useCallback, useEffect, useRef, useState } from 'react'

export interface ResponsiveSidebarConfig {
  leftMinWindow?: number
  rightMinWindow?: number
  leftMinPx?: number
  rightMinPx?: number
  centerMinPx?: number
  leftDefaultPx?: number
  rightDefaultPx?: number
  storageKey?: string
}

type Side = 'left' | 'right'

export function useResponsiveSidebars(config: ResponsiveSidebarConfig = {}) {
  const {
    leftMinWindow = 540,
    rightMinWindow = 760,
    leftMinPx = 220,
    rightMinPx = 180,
    centerMinPx = 250,
    leftDefaultPx = 260,
    rightDefaultPx = 240,
    storageKey = 'ui-warehouse:sidebar-widths'
  } = config

  const defaults: Record<Side, number> = { left: leftDefaultPx, right: rightDefaultPx }
  const mins: Record<Side, number> = { left: leftMinPx, right: rightMinPx }

  const loadWidths = (): Record<Side, number> => {
    if (typeof window === 'undefined') return { ...defaults }
    try {
      const raw = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
      return {
        left: Math.max(leftMinPx, Number(raw.left) || defaults.left),
        right: Math.max(rightMinPx, Number(raw.right) || defaults.right)
      }
    } catch {
      return { ...defaults }
    }
  }

  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(true)
  const [widths, setWidths] = useState<Record<Side, number>>(loadWidths)

  const autoCollapsed = useRef<Record<Side, boolean>>({ left: false, right: false })

  const persist = useCallback((w: Record<Side, number>) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(storageKey, JSON.stringify(w))
    } catch {
      // Best-effort storage
    }
  }, [storageKey])

  const reconcile = useCallback(() => {
    if (typeof window === 'undefined') return
    const width = window.innerWidth
    const fitsLeft = width >= leftMinWindow
    const fitsRight = width >= rightMinWindow

    if (!fitsLeft && !leftCollapsed) {
      setLeftCollapsed(true)
      autoCollapsed.current.left = true
    } else if (fitsLeft && autoCollapsed.current.left && leftCollapsed) {
      setLeftCollapsed(false)
      autoCollapsed.current.left = false
    }

    if (!fitsRight && !rightCollapsed) {
      setRightCollapsed(true)
      autoCollapsed.current.right = true
    } else if (fitsRight && autoCollapsed.current.right && rightCollapsed) {
      setRightCollapsed(false)
      autoCollapsed.current.right = false
    }
  }, [leftCollapsed, rightCollapsed, leftMinWindow, rightMinWindow])

  useEffect(() => {
    reconcile()
    window.addEventListener('resize', reconcile)
    return () => window.removeEventListener('resize', reconcile)
  }, [reconcile])

  const toggleLeft = useCallback(() => {
    setLeftCollapsed((prev) => {
      const willOpen = prev
      autoCollapsed.current.left = false
      if (willOpen && typeof window !== 'undefined' && window.innerWidth < leftMinPx + centerMinPx + rightMinPx) {
        setRightCollapsed(true)
      }
      return !prev
    })
  }, [leftMinPx, centerMinPx, rightMinPx])

  const toggleRight = useCallback(() => {
    setRightCollapsed((prev) => {
      const willOpen = prev
      autoCollapsed.current.right = false
      if (willOpen && typeof window !== 'undefined' && window.innerWidth < leftMinPx + centerMinPx + rightMinPx) {
        setLeftCollapsed(true)
      }
      return !prev
    })
  }, [leftMinPx, centerMinPx, rightMinPx])

  const setSidebarWidth = useCallback((side: Side, px: number) => {
    if (px < mins[side]) return
    setWidths((prev) => {
      const next = { ...prev, [side]: Math.round(px) }
      persist(next)
      return next
    })
  }, [mins, persist])

  return {
    widths,
    leftCollapsed,
    rightCollapsed,
    toggleLeft,
    toggleRight,
    setLeftCollapsed,
    setRightCollapsed,
    setSidebarWidth
  }
}
