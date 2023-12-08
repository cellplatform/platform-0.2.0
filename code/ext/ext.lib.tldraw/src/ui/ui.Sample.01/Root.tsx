import '@tldraw/tldraw/tldraw.css';

import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { CanvasConfig } from './ui.Canvas.Config';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Config: typeof CanvasConfig;
};
export const Canvas = FC.decorate<t.CanvasProps, Fields>(
  View,
  { DEFAULTS, Config: CanvasConfig },
  { displayName: 'Canvas' },
);
