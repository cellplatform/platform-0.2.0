import { COLORS, t, WrangleUrl } from '../common';
import { SpecList } from '../Entry.SpecList';
import { Harness } from '../Harness';

export const Entry = {
  isDev: WrangleUrl.navigate.isDev,

  /**
   * Render a harness with the selected `dev=namespace` import
   * or an index list of available specs.
   */
  async render(
    pkg: { name: string; version: string },
    specs: t.Imports,
    options: { location?: t.UrlInput; style?: t.CssValue } = {},
  ) {
    const url = WrangleUrl.navigate.formatDevFlag(options);
    const spec = await WrangleUrl.module(url, specs);
    const style = options.style ?? { Absolute: 0, backgroundColor: COLORS.WHITE };

    if (spec) {
      return <Harness spec={spec} style={style} />;
    } else {
      return <SpecList title={pkg.name} version={pkg.version} imports={specs} style={style} />;
    }
  },
};
