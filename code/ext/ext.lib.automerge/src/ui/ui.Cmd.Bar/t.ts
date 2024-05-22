import type { A, t } from './common';

/**
 * <Component>
 */
export type CmdBarProps = {
  enabled?: boolean;
  doc?: t.Lens | t.DocRef;
  path?: t.CmdBarPaths;
  debug?: string;
  focusOnReady?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

/**
 * Abstract path resolvers.
 */
export type CmdBarPaths = {
  text: t.ObjectPath;
  invoked: t.ObjectPath;
};

/**
 * The shape of the default [CmdHostPaths] as an object.
 */
export type CmdBarPathLens = {
  text?: string;
  invoked?: A.Counter;
};

/**
 * A fully resolved document object for a <CmdBar>.
 */
export type CmdBarDocObject = {
  text: string;
  invoked: number;
};
