import { COLORS, Color, type t } from './common';

type T = {
  props: { theme?: t.ModuleLoaderTheme };
  debug: { debugBg?: boolean; debugFill?: boolean };
};

/**
 * Helpers
 */
export const WrangleSpec = {
  mutateSubject(dev: t.DevTools<T>, current: T) {
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
    if (debug.debugFill) ctx.subject.size('fill', 80);
    else ctx.subject.size([400, 200]);
  },

  link(dev: t.DevTools<T>, label: string | [string, string], namespace: string) {
    dev.button(label, (e) => {
      const url = new URL(location.href);
      url.searchParams.set('dev', namespace);
      window.location.href = url.href;
    });
  },
} as const;
