import type { t } from './common';

/**
 * Abstract path resolvers.
 */
export type CmdhostPaths = {
  cmd: t.ObjectPath;
  address: t.ObjectPath;
  selected: t.ObjectPath;
};

/**
 * <Component>
 */
export type NetworkCmdhost = {
  pkg?: { name: string; version: string };
  imports?: t.ModuleImports;
  doc?: t.Lens;
  path?: t.CmdhostPaths;
  enabled?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
