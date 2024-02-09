import type { t } from './common';

/**
 * <Component>
 */
export type ModuleLoaderProps = {
  command?: ModuleLoaderCommandProps;
  flipped?: boolean;
  style?: t.CssValue;
};

export type ModuleLoaderCommandProps = {
  visible?: boolean;
};
