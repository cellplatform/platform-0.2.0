import { Global } from '../Css/global.mjs';
import { GlobalStyles } from './css.global.mjs';
import { NormalizeStyles } from './css.normalize.mjs';

let isReset = false;

/**
 * Installs the reset stylesheets globally.
 */
export function reset() {
  if (isReset) return;
  isReset = true;

  Global(NormalizeStyles);
  Global(GlobalStyles);
}
