import { type t } from './common';

export { CommandBar } from '../Command.Bar';
export { Flip } from '../Flip';
export { PropList } from '../PropList';

export * from '../common';

/**
 * Constants
 */
const theme: t.ModuleNamespaceTheme = 'Light';
const command: t.ModuleNamespaceCommandbarProps = {
  visible: true,
};

export const DEFAULTS = {
  displayName: 'ModuleNamespace',
  command,
  theme,
} as const;
