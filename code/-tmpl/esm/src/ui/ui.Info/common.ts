import { Pkg, type t } from '../common';
export * from '../common';

type P = t.InfoProps;

/**
 * Constants
 */
const name = 'Info';
const props: t.PickRequired<P, 'theme' | 'enabled' | 'fields'> = {
  theme: 'Dark',
  enabled: true,
  get fields() {
    return fields.default;
  },
};

const fields = {
  get all(): t.InfoField[] {
    return ['Module', 'Module.Verify', 'Component'];
  },
  get default(): t.InfoField[] {
    return ['Module', 'Module.Verify'];
  },
} as const;

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  query: { dev: 'dev' },
  props,
  fields,
} as const;
