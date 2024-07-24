import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'CmdView';
const props: t.PickRequired<t.CmdViewProps, 'theme' | 'readOnly' | 'historyStack'> = {
  theme: 'Dark',
  readOnly: false,
  historyStack: true,
};

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  props,
} as const;
