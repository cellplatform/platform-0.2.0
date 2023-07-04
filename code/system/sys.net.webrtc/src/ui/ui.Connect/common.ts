import { type t } from '../common';

export * from '../common';
export { WebRtc } from '../../WebRtc';

/**
 * Defaults
 */
const edge: t.ConnectEdge = 'Top';

export const DEFAULTS = {
  edge,
} as const;
