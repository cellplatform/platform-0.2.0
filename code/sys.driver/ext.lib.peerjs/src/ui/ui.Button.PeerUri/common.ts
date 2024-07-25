import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'Button.PeerUri';
const props: t.PickRequired<t.PeerUriButtonProps, 'theme'> = {
  theme: 'Dark',
};

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  props,
} as const;
