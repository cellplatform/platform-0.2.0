import { DEFAULTS as HTTP_DEFAULTS } from '../../http';
import { type t } from '../common';

export { DenoHttp } from '../../http';
export * from '../common';

/**
 * Constants
 */
const endpoint: t.DenoHttpOptions = {
  forcePublic: false,
  origins: HTTP_DEFAULTS.origins,
};

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
