import { Pkg, type t } from '../common';

export * from '../common';
export { KeyHint } from '../KeyHint';
export { useFocus } from '../../ui.use';

/**
 * Constants
 */
const name = 'CmdBar.Dev';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  Main: {
    fields: {
      get all(): t.MainField[] {
        return ['Module.Args', 'Module.Run'];
      },
      get default(): t.MainField[] {
        return DEFAULTS.Main.fields.all;
      },
    },
  },
} as const;
