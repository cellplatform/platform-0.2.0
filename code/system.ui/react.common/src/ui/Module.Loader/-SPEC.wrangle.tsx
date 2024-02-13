import { COLORS, Color, type t, Pkg, Icons } from './common';

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

  link(dev: t.DevTools<T>, label: string, namespace: string) {
    const elRight = <Icons.NewTab size={16} />;

    dev.button((btn) => {
      btn
        .label(label)
        .right((e) => elRight)
        .onClick((e) => {
          const url = new URL(location.href);
          namespace = `${Pkg.name}.${namespace}`;
          url.searchParams.set('dev', namespace);
          window.open(url.href, '_blank', 'noopener,noreferrer');
        });
    });
  },
} as const;
