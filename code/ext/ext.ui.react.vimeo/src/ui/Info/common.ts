import { type t } from '../common';
export * from '../common';

/**
 * Constants
 */
export const FIELDS: t.InfoField[] = ['Module', 'Module.Verify'];
const fields = ['Module', 'Module.Verify'] as t.InfoField[];

export const DEFAULTS = {
  fields,
  query: { dev: 'dev' },
} as const;
