import type { t } from './common';

/**
 * Abstract path resolvers.
 */
export type CmdHostPaths = {
  cmd: t.CmdBarPaths;
};

/**
 * <Component>
 */
export type CmdHostProps = {
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
