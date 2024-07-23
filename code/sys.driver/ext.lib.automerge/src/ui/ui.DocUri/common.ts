import { Pkg, type t } from '../common';

import { Doc } from '../../crdt';

export * from '../common';
export { MonospaceButton } from '../ui.Buttons';
export { Doc };

/**
 * Constants
 */
const name = 'DocUri';
const props: t.PickRequired<t.DocUriProps, 'theme' | 'shorten' | 'prefix' | 'head' | 'clipboard'> =
  {
    theme: 'Dark',
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
