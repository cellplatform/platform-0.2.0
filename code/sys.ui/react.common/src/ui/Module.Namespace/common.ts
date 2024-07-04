import { Pkg, type t } from './common';

export { CmdBar } from '../CmdBar';
export { Flip } from '../Flip';
export { PropList } from '../PropList';

export * from '../common';

/**
 * Constants
 */
const theme: t.ModuleNamespaceTheme = 'Light';
const cmdbar: t.ModuleNamespaceCmdbarProps = {
  visible: true,
};

export const DEFAULTS = {
  displayName: `${Pkg.name}.ModuleNamespace`,
  cmdbar,
  theme,
} as const;
