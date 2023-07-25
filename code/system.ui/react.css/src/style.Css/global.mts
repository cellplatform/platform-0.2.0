import PluginGlobal from 'jss-plugin-global';
import { R, glamor, rx, type t } from '../common';

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
export const Global: t.CssGlobal = (
  styles: t.CssPropsMap,
  options: {
    prefix?: string;
    dispose$?: t.Observable<any>;
  } = {},
) => {
  if (R.isEmpty(styles)) {
    return { dispose: () => undefined } as const;
  }

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
  const stylesheet = glamor.jss.createStyleSheet({ '@global': global });
  stylesheet.attach();

  // Disposable.
  const { dispose$, dispose } = rx.disposable(options.dispose$);
  dispose$.subscribe(() => stylesheet?.detach());

  /**
   * API
   */
  return { dispose } as const;
};

/**
 * [Helpers]
 */

function toCssSelector(args: { key: string; prefix?: string }) {
  const { key, prefix } = args;
  const selector = prefix ? `${prefix} ${key}` : key;
  return selector.replace(/^\n/, '').replace(/\n$/, '').trim();
}
