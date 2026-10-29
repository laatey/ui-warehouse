import React from 'react';
import { Home, Eye, Box } from 'lucide-react';
import { ViewportNavigationGizmoProps, CameraOrientation } from './types';

export function ViewportNavigationGizmo({
  currentOrientation = 'iso-se',
  onSelectOrientation,
  onHomeClick,
  onTogglePerspective,
  isPerspective = true,
  size = 110,
  className = '',
}: ViewportNavigationGizmoProps): React.JSX.Element {
  const faces: { id: CameraOrientation; label: string; gridArea: string }[] = [
    { id: 'top', label: 'TOP', gridArea: '1 / 2 / 2 / 3' },
    { id: 'left', label: 'LEFT', gridArea: '2 / 1 / 3 / 2' },
    { id: 'front', label: 'FRONT', gridArea: '2 / 2 / 3 / 3' },
    { id: 'right', label: 'RIGHT', gridArea: '2 / 3 / 3 / 4' },
    { id: 'bottom', label: 'BOT', gridArea: '3 / 2 / 4 / 3' },
  ];

  return (
    <div
      className={`relative flex flex-col items-center p-2 rounded-xl border border-border/80 bg-background/85 backdrop-blur-md shadow-lg select-none ${className}`}
      style={{ width: size, height: size + 24 }}
    >
      {/* Top Controls Row */}
      <div className="flex items-center justify-between w-full px-1 mb-1 text-muted-foreground">
        {onHomeClick && (
          <button
            type="button"
            onClick={onHomeClick}
            title="Reset to Home View"
            aria-label="Home view"
            className="p-1 rounded-md hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
        )}

        {onTogglePerspective && (
          <button
            type="button"
            onClick={onTogglePerspective}
            title={isPerspective ? 'Switch to Orthographic' : 'Switch to Perspective'}
            aria-label="Toggle camera projection"
            className="p-1 rounded-md hover:text-foreground hover:bg-muted transition-colors cursor-pointer ml-auto"
          >
            {isPerspective ? <Eye className="w-3.5 h-3.5" /> : <Box className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Orientation Compass Grid */}
      <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full flex-1">
        {faces.map((face) => {
          const isActive = currentOrientation === face.id;
          return (
            <button
              key={face.id}
              type="button"
              onClick={() => onSelectOrientation?.(face.id)}
              style={{ gridArea: face.gridArea }}
              title={`View ${face.label}`}
              className={`flex items-center justify-center rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/70 text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {face.label}
            </button>
          );
        })}

        {/* Isometric Corner Button (Top-Right ISO-NE) */}
        <button
          type="button"
          onClick={() => onSelectOrientation?.('iso-ne')}
          title="Isometric View"
          style={{ gridArea: '1 / 3 / 2 / 4' }}
          className="flex items-center justify-center rounded text-[8px] font-mono bg-muted/40 text-muted-foreground/60 hover:bg-accent hover:text-foreground cursor-pointer"
        >
          ISO
        </button>

        {/* Isometric Corner Button (Bottom-Right ISO-SE) */}
        <button
          type="button"
          onClick={() => onSelectOrientation?.('iso-se')}
          title="Isometric South-East"
          style={{ gridArea: '3 / 3 / 4 / 4' }}
          className="flex items-center justify-center rounded text-[8px] font-mono bg-muted/40 text-muted-foreground/60 hover:bg-accent hover:text-foreground cursor-pointer"
        >
          3D
        </button>
      </div>
    </div>
  );
}
