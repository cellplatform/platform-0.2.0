import { COLORS, DevIcons, type t } from '../common';
import { Wrangle } from './u.Wrangle';

type O = Record<string, unknown>;

/**
 * Helpers for working with common themes within the harness.
 */
export const Theme = {
  is(theme: t.CommonTheme = 'Light') {
    return { dark: theme === 'Dark', light: theme === 'Light' } as const;
  },

  /**
   * Adjust the theme of the DevHarness.
   */
  background(input: t.DevCtx | t.DevTools, value: t.CommonTheme = 'Light') {
    const is = Theme.is(value);
    const ctx = Wrangle.ctx(input);
    if (!ctx) throw new Error(`Dev {ctx} not retrieved`);

    const host = ctx.host;
    if (is.light) host.backgroundColor(null).tracelineColor(null);
    if (is.dark) host.backgroundColor(COLORS.DARK).tracelineColor(0.08);
  },

  /**
   * Insert a boolean switch for selecting the theme.
   */
  switch<T extends O>(
    dev: t.DevTools<T>,
    current: (d: T) => t.CommonTheme | undefined,
    update: (d: T, value: t.CommonTheme) => void,
  ) {
    const defaultTheme: t.CommonTheme = 'Light';
    dev.button((btn) => {
      btn
        .label((e) => `theme: ${current(e.state) ?? defaultTheme}`)
        .right((e) => {
          const is = Theme.is(current(e.state) ?? defaultTheme);
          const Icon = is.dark ? DevIcons.Theme.Dark : DevIcons.Theme.Light;
          return <Icon size={16} />;
        })
        .onClick((e) => {
          const prev = current(e.state.current) ?? defaultTheme;
          const next = prev === 'Light' ? 'Dark' : 'Light';
          dev.change((d) => update(d, next));
          Theme.background(dev.ctx, next);
        });
    });
  },
} as const;
