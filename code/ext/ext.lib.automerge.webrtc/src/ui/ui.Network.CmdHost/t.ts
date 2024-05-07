import type { A, t } from './common';

/**
 * Abstract path resolvers.
 */
export type CmdHostPaths = {
  uri: { loaded: t.ObjectPath; selected: t.ObjectPath };
  cmd: { text: t.ObjectPath; enter: t.ObjectPath };
};

/**
 * The shape of the default [CmdHostPaths] as an object.
 */
export type CmdHostPathLens = {
  uri?: { selected?: t.UriString; loaded?: t.UriString };
  cmd?: { text?: string; enter?: A.Counter };
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
  hrDepth?: t.CmdHostProps['hrDepth'];
  enabled?: boolean;
  debug?: string;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onLoad?: CmdHostLoadHandler;
};

/**
 * Events
 */
export type CmdHostLoadHandler = (e: CmdHostLoadHandlerArgs) => void;
export type CmdHostLoadHandlerArgs = { uri: t.UriString; cmd: string };
