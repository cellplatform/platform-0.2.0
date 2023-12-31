import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const filter: t.DevDeleteFilter = (e) => !['fs', 'fs:sys'].includes(e.name);

export const DEFAULTS = {
  displayName: 'IndexedDb.Dev.Delete',
  filter,
} as const;
