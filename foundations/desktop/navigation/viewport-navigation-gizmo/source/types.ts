export type CameraOrientation =
  | 'top'
  | 'bottom'
  | 'front'
  | 'back'
  | 'left'
  | 'right'
  | 'iso-ne'
  | 'iso-nw'
  | 'iso-se'
  | 'iso-sw';

export interface ViewportNavigationGizmoProps {
  currentOrientation?: CameraOrientation;
  onSelectOrientation?: (orientation: CameraOrientation) => void;
  onHomeClick?: () => void;
  onTogglePerspective?: () => void;
  isPerspective?: boolean;
  size?: number;
  className?: string;
}
