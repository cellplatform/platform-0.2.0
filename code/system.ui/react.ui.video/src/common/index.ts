import type * as t from './types.mjs';

export { t };
export * from '../index.pkg.mjs';
export * from './libs.mjs';

export const COLORS = {
  BLACK: '#000',
  WHITE: '#fff',
  DARK: '#293042', // Inky blue/black.
  BLUE: '#4B89FF',
  CYAN: '#00C2FF',
  MAGENTA: '#FE0064',
} as const;
