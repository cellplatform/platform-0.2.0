import PluginGlobal from 'jss-plugin-global';
import { glamor, R, t } from '../common';

glamor.jss.use(PluginGlobal);

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
export const Global: t.CssGlobal = (styles: t.CssPropsMap, options: { prefix?: string } = {}) => {
  if (R.isEmpty(styles)) return;

  // Prepare styles for global insertion.
  const { prefix } = options;
  const global: { [key: string]: t.CssPropsMapObject } = {};
  Object.keys(styles).forEach((key) => {
    const style = styles[key];
    key.split(',').forEach((key) => {
      const selector = toCssSelector({ key, prefix });
      global[selector] = style;
    });
  });

  // Load the global styles into the document.
  glamor.jss.createStyleSheet({ '@global': global }).attach();
};

/**
 * [Helpers]
 */

function toCssSelector(args: { key: string; prefix?: string }) {
  const { key, prefix } = args;
  const selector = prefix ? `${prefix} ${key}` : key;
  return selector.replace(/^\n/, '').replace(/\n$/, '').trim();
}
