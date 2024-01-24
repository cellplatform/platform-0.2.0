import { Global } from '../style.Css/global';
import { GlobalStyles } from './css.global';
import { NormalizeStyles } from './css.normalize';

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
