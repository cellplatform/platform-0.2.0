import { Color, COLORS, type t } from './common';
const { WHITE, DARK } = COLORS;

export const Theme = {
  init(monaco: t.Monaco) {
    Theme.Light.define(monaco);
    Theme.Dark.define(monaco);
  },

  toName(theme: t.CommonTheme = 'Light') {
    if (theme === 'Light') return Theme.Light.name;
    if (theme === 'Dark') return Theme.Dark.name;
    throw new Error(`Theme '${theme}' not supported`);
  },

  Light: {
    name: 'sys-light',
    define(monaco: t.Monaco) {
      monaco.editor.defineTheme(Theme.Light.name, {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': WHITE,
        },
      });
    },
  },

  Dark: {
    name: 'sys-dark',
    define(monaco: t.Monaco) {
      monaco.editor.defineTheme(Theme.Dark.name, {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': DARK,
          'editor.lineHighlightBorder': lighten(DARK, 4),
        },
      });
    },
  },
} as const;

/**
 * Helpers
 */
const darken = (color: string, value: number) => Color.create(color).darken(value).toHexString();
const lighten = (color: string, value: number) => Color.create(color).lighten(value).toHexString();
