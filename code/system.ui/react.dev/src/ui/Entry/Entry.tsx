import { COLORS, t, WrangleUrl } from '../common';
import { SpecList } from '../Entry.SpecList';
import { Harness } from '../Harness';
import { KeyboardMonitor } from '../Keyboard';

export const Entry = {
  isDev: WrangleUrl.navigate.isDev,

  /**
   * Render a harness with the selected `dev=namespace` import
   * or an index list of available specs.
   */
  async render(
    pkg: { name: string; version: string },
    specs: t.Imports,
    options: {
      location?: t.UrlInput;
      badge?: t.SpecListBadge;
      hrDepth?: number;
      keyboard?: boolean;
      style?: t.CssValue;
    } = {},
  ) {
    const { keyboard = true } = options;
    const url = WrangleUrl.navigate.formatDevFlag(options);
    const spec = await WrangleUrl.module(url, specs);
    const style = options.style ?? { Absolute: 0, backgroundColor: COLORS.WHITE };

    if (keyboard) KeyboardMonitor.listen();

    if (spec) {
      return <Harness spec={spec} style={style} />;
    } else {
      return (
        <SpecList
          title={pkg.name}
          version={pkg.version}
          imports={specs}
          badge={options.badge}
          hrDepth={options.hrDepth}
          style={style}
        />
      );
    }
  },
};
