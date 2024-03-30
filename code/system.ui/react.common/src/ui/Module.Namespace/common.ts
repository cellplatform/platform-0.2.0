import { type t } from './common';

export { CmdBar } from '../Cmd.Bar';
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
  displayName: 'ModuleNamespace',
  cmdbar,
  theme,
} as const;
