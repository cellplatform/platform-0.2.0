import '@tldraw/tldraw/tldraw.css';

import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { Config } from './ui.Config';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Config: typeof Config;
};
export const Canvas = FC.decorate<t.CanvasProps, Fields>(
  View,
  { DEFAULTS, Config: Config },
  { displayName: 'Canvas' },
);
