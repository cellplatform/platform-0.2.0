import { type t } from '../common';
import { DEFAULTS as HTTP_DEFAULTS } from '../../Http';

export { Http } from '../../Http';
export * from '../common';

/**
 * Constants
 */
const endpoint: t.HttpOptions = { forcePublic: false, origins: HTTP_DEFAULTS.origins };

export const DEFAULTS = {
  displayName: 'Info',
  stateful: false,
  endpoint,
  fields: {
    get all(): t.InfoField[] {
      return ['Module', 'Module.Verify', 'Auth.AccessToken', 'Projects.List'];
    },
    get default(): t.InfoField[] {
      return ['Module', 'Module.Verify'];
    },
  },
  query: { dev: 'dev' },
  projects: { label: 'Projects' },
} as const;
