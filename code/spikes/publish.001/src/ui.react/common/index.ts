import type * as t from './types.mjs';

export { t };
export * from '../../ui.logic/common';
export { State, QueryString, Fetch } from '../../ui.logic/index.mjs';
export { css, Color, Style } from 'sys.util.css';

export const COLORS = {
  BLACK: '#000',
  WHITE: '#fff',
  DARK: '#293042', // Inky blue/black.
  CYAN: '#00C2FF',
  MAGENTA: '#FE0064',
  BLUE: '#4D7EF7',
};

export const DEFAULTS = {
  MD: {
    DOC: { width: 692 },
    CLASS: {
      ROOT: 'sys-md-doc',
      BLOCK: 'sys-md-block',
    },
  },
};
