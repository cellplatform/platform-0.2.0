import type { A, t } from './common';

/**
 * Abstract path resolvers.
 */
export type CmdHostPaths = {
  uri: { loaded: t.ObjectPath; selected: t.ObjectPath };
  cmd: { text: t.ObjectPath; invoked: t.ObjectPath };
};

/**
 * The shape of the default [CmdHostPaths] as an object.
 */
export type CmdHostPathLens = {
  uri?: { selected?: t.UriString; loaded?: t.UriString };
  cmd?: { text?: string; invoked?: A.Counter };
};

/**
 * A fully resolved document object for a <CmdHost>.
 */
export type CmdHostDocObject = {
  uri: { selected: t.UriString; loaded: t.UriString };
  cmd: { text: string; invoked: number };
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
  onCommand?: CmdHostCommandHandler;
};

/**
 * Events
 */
export type CmdHostLoadHandler = (e: CmdHostLoadHandlerArgs) => void;
export type CmdHostLoadHandlerArgs = { uri: t.UriString; cmd: string };

export type CmdHostCommandHandler = (e: CmdHostCommandHandlerArgs) => void;
export type CmdHostCommandHandlerArgs = {
  readonly cmd: { text: string; clear(): void };
  unload(): void;
};
