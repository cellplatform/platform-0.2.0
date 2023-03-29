import { COLORS, t, DevBase, DevWrangle, DevKeyboard } from '../common';
import { CmdHostStateful } from '../CmdHost';
import { KeyboardActions } from './Keyboard.mjs';

type EscapeAction = 'ReloadRootUrl';

type Options = {
  location?: t.UrlInput;
  badge?: t.SpecListBadge;
  hrDepth?: number;
  keyboard?: boolean;
  doubleEscapeKeyAction?: null | EscapeAction;
  style?: t.CssValue;
};

/**
 * Render a harness with the selected `dev=<namespace>` import
 * or an index list of available specs.
 */
export async function render(
  pkg: { name: string; version: string },
  specs: t.SpecImports,
  options: Options = {},
) {
  const { keyboard = true, doubleEscapeKeyAction = 'ReloadRootUrl' } = options;
  const url = DevWrangle.Url.navigate.formatDevFlag(options);
  const spec = await DevWrangle.Url.module(url, specs);

  const style = options.style ?? {
    Absolute: 0,
    backgroundColor: COLORS.WHITE,
  };

  if (spec) {
    if (keyboard) {
      DevKeyboard.listen({
        cancelPrint: true,
        cancelSave: true,
        onDoubleEscape(e) {
          KeyboardActions.onDoubleEscape(doubleEscapeKeyAction);
        },
      });
    }

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
