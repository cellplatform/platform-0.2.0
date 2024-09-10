import { DEFAULTS as BASE, Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'MonacoEditor';
const props: t.PickRequired<
  t.MonacoEditorProps,
  'theme' | 'readOnly' | 'minimap' | 'tabSize' | 'language' | 'enabled'
> = {
  theme: 'Dark',
  enabled: true,
  readOnly: false,
  minimap: true,
  tabSize: 2,
  language: BASE.languages[0],
};

export const DEFAULTS = {
  ...BASE,
  name,
  displayName: `${Pkg.name}:${name}`,
  props,
} as const;
