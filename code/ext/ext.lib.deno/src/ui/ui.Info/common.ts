import { type t } from '../common';
export { Http } from '../../Http';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: 'Info',
  fields: {
    get all(): t.InfoField[] {
      return ['Module', 'Module.Verify', 'Auth.AccessToken', 'Projects.List'];
    },
    get default(): t.InfoField[] {
      return ['Module', 'Module.Verify'];
    },
  },
  query: { dev: 'dev' },
} as const;
