import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const position: t.EdgePos = ['center', 'bottom'];
const data: t.VideoLayout__ = { position };

export const DEFAULTS = {
  data,
  position,
  playing: false,
  muted: false,
  timestamp: undefined,
} as const;
