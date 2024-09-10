import { Pkg, type t } from '../common';

import { Doc } from '../../crdt';

export * from '../common';
export { MonospaceButton } from '../ui.Buttons';
export { Doc };

type P = t.DocUriProps;

/**
 * Constants
 */
const name = 'DocUri';
const props: t.PickRequired<P, 'theme' | 'enabled' | 'shorten' | 'prefix' | 'head' | 'clipboard'> =
  {
    enabled: true,
    theme: 'Light',
    shorten: [4, 4],
    prefix: 'crdt',
    head: 2,
    clipboard: true,
  };

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  props,
} as const;
