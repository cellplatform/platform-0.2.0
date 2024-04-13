import type { t } from './common';

/**
 * Abstract path resolvers.
 */
export type CmdHostPaths = {
  cmd: t.ObjectPath;
  uri: t.ObjectPath;
  selected: t.ObjectPath;
};

/**
 * <Component>
 */
export type NetworkCmdHost = {
  pkg?: { name: string; version: string };
  imports?: t.ModuleImports;
  doc?: t.Lens;
  path?: t.CmdHostPaths;
  enabled?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  debug?: string;
};
