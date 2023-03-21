import { COLORS, t, DevBase, DevWrangle, DevKeyboard } from '../common';
import { CmdHost, CmdHostStateful } from '../CmdHost';

/**
 * Render a harness with the selected `dev=<namespace>` import
 * or an index list of available specs.
 */
export async function render(
  pkg: { name: string; version: string },
  specs: t.SpecImports,
  options: {
    location?: t.UrlInput;
    badge?: t.SpecListBadge;
    hrDepth?: number;
    keyboard?: boolean;
    style?: t.CssValue;
  } = {},
) {
  const { keyboard = true } = options;
  const url = DevWrangle.Url.navigate.formatDevFlag(options);
  const spec = await DevWrangle.Url.module(url, specs);
  const style = options.style ?? {
    Absolute: 0,
    backgroundColor: COLORS.WHITE,
  };

  if (spec) {
    if (keyboard) DevKeyboard.listen();
    return <DevBase.Harness spec={spec} style={style} />;
  }

  return (
    <CmdHostStateful
      pkg={pkg}
      specs={specs}
      badge={options.badge}
      hrDepth={options.hrDepth}
      style={style}
    />
  );
}
