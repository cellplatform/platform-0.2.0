import { type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const allFields: t.InfoField[] = ['Module', 'Module.Verify', 'Component', 'Repo'];
const defaultFields: t.InfoField[] = ['Module', 'Module.Verify'];

export const DEFAULTS = {
  fields: { all: allFields, default: defaultFields },
  query: { dev: 'dev' },
} as const;
