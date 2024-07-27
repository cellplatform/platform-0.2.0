import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'Button.PeerUri';
const props: t.PickRequired<
  t.PeerUriButtonProps,
  'theme' | 'fontSize' | 'monospace' | 'id' | 'prefix' | 'bold' | 'clipboard' | 'enabled'
> = {
  prefix: 'peer',
  id: 'unknown',
  fontSize: 14,
  monospace: false,
  bold: false,
  clipboard: true,
  enabled: true,
  theme: 'Dark',
};

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  props,
} as const;
