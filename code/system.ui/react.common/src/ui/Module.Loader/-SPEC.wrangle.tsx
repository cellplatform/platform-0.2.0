import { Dev } from '../../test.ui';
import { COLORS, Color, Icons, Pkg, type t } from './common';

type T = {
  props: { theme?: t.ModuleLoaderTheme };
  debug: { debugBg?: boolean; debugFill?: boolean };
};

/**
 * Helpers
 */
export const WrangleSpec = {
  mutateSubject(
    dev: t.DevTools<T>,
    current: T,
    options: { width?: number | null; height?: number | null } = {},
  ) {
    const ctx = dev.ctx;
    const { props, debug } = current;
    const isDark = props.theme === 'Dark';
    const bgThemeColor = isDark ? Color.alpha(COLORS.WHITE, 0.02) : COLORS.WHITE;

    /**
     * Colors
     */
    ctx.subject.backgroundColor(debug.debugBg ? bgThemeColor : 0);
    ctx.host
      .backgroundColor(isDark ? COLORS.DARK : null)
      .tracelineColor(isDark ? Color.alpha(COLORS.WHITE, 0.1) : null);

    /**
     * Size
     */
    const width = options.width === null ? null : options.width ?? 400;
    const height = options.height === null ? null : options.height ?? 200;
    if (debug.debugFill) ctx.subject.size('fill', 80);
    else ctx.subject.size([width, height]);
  },
} as const;
