import { t } from '../common.mjs';
/**
 * Applies global CSS rules.
 *
 *    https://github.com/threepointone/glamor/blob/master/docs/howto.md#global-css-rule
 *    https://cssinjs.org/jss-plugin-global
 *
 * Example:
 *
 *        const styles = {
 *          'html, body': { background: 'red' },
 *          'p': { color: 'blue' }
 *        };
 *        global(styles, { prefix: '.markdown' });
 *
 * Or create styles under a common selector "prefix":
 *
 *        const styles = {
 *          'p': { color: 'blue' },
 *        };
 *        global(styles, { prefix: '.markdown' });
 *
 */
export declare const Global: t.CssGlobal;
export { Global as global };
