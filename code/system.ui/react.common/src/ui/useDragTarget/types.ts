import type { RefObject } from 'react';

export type Dropped = { files: DroppedFile[]; urls: string[] };
export type DroppedFile = { path: string; data: Uint8Array; mimetype: string };

/**
 * Hook
 */
export type DragTargetHookArgs<T extends HTMLElement> = {
  ref?: React.RefObject<T>;
  enabled?: boolean;
  suppressGlobal?: boolean; // Prevent drops anywhere else on the screen.
  onDrop?: DragTargetDropHandler;
  onDragOver?: (e: { isOver: boolean }) => void;
};

export type DragTargetHook<T extends HTMLElement> = {
  readonly ref: RefObject<T>;
  readonly is: DragTargetFlags;
  readonly dropped?: Dropped;
  reset(): void;
};

export type DragTargetFlags = {
  enabled?: boolean;
  over?: boolean;
  dropped?: boolean;
};

/**
 * Events
 */
export type DragTargetDropHandler = (e: DragTargetDropHandlerArgs) => void;
export type DragTargetDropHandlerArgs = Dropped;

export type DragTargetOverHandler = (e: DragTargetOverHandlerArgs) => void;
export type DragTargetOverHandlerArgs = { isOver: boolean };
