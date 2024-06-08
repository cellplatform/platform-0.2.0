import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const os: t.UserAgentOSKind = 'macOS';

const modifiers = {
  macOS: { meta: '⌘', alt: '⌥', ctrl: '⇧', shift: '⌃' },
  posix: { meta: '⊞', alt: 'Alt', ctrl: 'Ctrl', shift: 'Shift' },
  windows: { meta: '⊞', alt: 'Alt', ctrl: 'Ctrl', shift: 'Shift' },
};

export const DEFAULTS = {
  displayName: {
    KeyHint: `${Pkg.name}.KeyHint`,
    KeyHintCombo: `${Pkg.name}.KeyHint.Combo`,
  },
  os,
  text: '⍰',
  parse: true,
  modifiers,
} as const;
