import { COLORS, DevIcons, type t, ObjectPath } from '../common';
import { Wrangle } from './u.Wrangle';

type O = Record<string, unknown>;
type Color = string | number;

/**
 * Helpers for working with common themes within the harness.
 */
export const Theme = {
  is(theme: t.CommonTheme = 'Light') {
    return {
      dark: theme === 'Dark',
      light: theme === 'Light',
    } as const;
  },

  color(theme: t.CommonTheme = 'Light') {
    const is = Theme.is(theme);
    return is.dark ? COLORS.WHITE : COLORS.DARK;
  },

  /**
   * Adjust the theme of the DevHarness.
   */
  background(
    input: t.DevCtx | t.DevTools,
    theme: t.CommonTheme = 'Light',
    subjectLight?: Color | null,
    subjectDark?: Color | null,
  ) {
    const is = Theme.is(theme);
    const ctx = Wrangle.ctx(input);
    if (!ctx) throw new Error(`Dev {ctx} not retrieved`);

    const { host, subject } = ctx;
    if (is.light) host.backgroundColor(null).tracelineColor(null);
    if (is.dark) host.backgroundColor(COLORS.DARK).tracelineColor(0.08);

    if (!!subjectLight || !!subjectDark) {
      if (!!subjectLight) subject.backgroundColor(is.light ? subjectLight : 0);
      if (!!subjectDark) subject.backgroundColor(is.dark ? subjectDark : 0);
    }
  },

  /**
   * A theme selector switch using a typed {Object} path.
   */
  switch<T extends O>(
    dev: t.DevTools<T>,
    path: t.TypedObjectPath<T>,
    onChange?: (value: t.CommonTheme) => void,
  ) {
    return Theme.switcher(
      dev,
      (d) => ObjectPath.resolve(d, path) as t.CommonTheme | undefined,
      (d, value) => {
        ObjectPath.mutate(d, path, value);
        onChange?.(value);
      },
    );
  },

  switcher<T extends O>(
    dev: t.DevTools<T>,
    current: (d: T) => t.CommonTheme | undefined,
    mutate: (d: T, value: t.CommonTheme) => void,
  ) {
    const defaultTheme: t.CommonTheme = 'Light';
    return dev.button((btn) => {
      btn
        .label((e) => `theme: "${current(e.state) ?? defaultTheme}"`)
        .right((e) => {
          const is = Theme.is(current(e.state) ?? defaultTheme);
          const Icon = is.dark ? DevIcons.Theme.Dark : DevIcons.Theme.Light;
          return <Icon size={16} />;
        })
        .onClick((e) => {
          const prev = current(e.state.current) ?? defaultTheme;
          const next = prev === 'Light' ? 'Dark' : 'Light';
          dev.change((d) => mutate(d, next));
          Theme.background(dev.ctx, next);
        });
    });
  },
} as const;
