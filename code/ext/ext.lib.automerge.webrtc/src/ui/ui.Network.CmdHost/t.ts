import type { t } from './common';

/**
 * Abstract path resolvers.
 */
export type CmdHostPaths = {
  uri: { loaded: t.ObjectPath; selected: t.ObjectPath };
  cmd: { text: t.ObjectPath };
};

/**
 * The shape of the default [CmdHostPaths] as an object.
 */
export type CmdHostPathLens = {
  cmd?: { text?: string };
  uri?: { selected?: t.UriString; loaded?: t.UriString };
};

/**
 * <Component>
 */
export type NetworkCmdHost = {
  pkg?: { name: string; version: string };
  imports?: t.ModuleImports;
  doc?: t.Lens;
  path?: t.CmdHostPaths;
  badge?: t.ImageBadge;
  enabled?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  debug?: string;
};
