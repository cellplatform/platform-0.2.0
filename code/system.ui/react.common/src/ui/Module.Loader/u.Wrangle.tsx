import { DEFAULTS, type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  is(props: t.ModuleLoaderProps) {
    const { spinning = DEFAULTS.spinning } = props;
    const theme = Wrangle.theme(props);
    return {
      dark: theme === 'Dark',
      light: theme === 'Light',
      spinning,
    } as const;
  },

  theme(props: t.ModuleLoaderProps) {
    const { theme = DEFAULTS.theme } = props;
    return theme;
  },

  spinner(props: { spinner?: t.ModuleLoaderSpinner }) {
    return { ...DEFAULTS.spinner, ...props.spinner };
  },

  factoryProps(
    factory: t.ModuleLoaderStatefulProps['factory'],
  ): t.ModuleLoaderStatefulFactoryProp | undefined {
    if (!factory || factory === null) return undefined;
    if (typeof factory === 'function') return { front: factory };
    if (typeof factory === 'object') return factory;
    return undefined;
  },
} as const;
