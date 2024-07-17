import { Pkg, type t } from '../common';

import { Doc } from '../../crdt';

export * from '../common';
export { MonospaceButton } from '../ui.Buttons';
export { Doc };

/**
 * Constants
 */
const uri: Required<t.InfoDataDocUri> = {
  shorten: [4, 4],
  prefix: 'crdt',
  head: 2,
  clipboard: true,
};

const name = 'DocUri';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  uri,
} as const;
