import { type t } from './common';
export * from '../common';
export { Position } from '../ui.Position';

/**
 * Constants
 */

const pos: t.Pos = ['center', 'center'];

export const DEFAULTS = {
  pos,
} as const;
