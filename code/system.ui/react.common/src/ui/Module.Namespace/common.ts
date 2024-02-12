import { type t } from './common';

export * from '../common';
export { Flip } from '../Flip';
export { CommandBar } from '../Command.Bar';

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
