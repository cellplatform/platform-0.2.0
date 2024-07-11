import type { t } from './common';

type C = t.CmdBarRef | t.CmdBarCtrl | t.Cmd<t.CmdBarCtrlType>;

export type MainField = 'Module.Args' | 'Module.Run';

/**
 * Component
 */
export type MainProps = {
  fields?: (t.MainField | undefined | null)[];
  argsCard?: MainArgsCardProps;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

/**
 * Component
 */
export type MainConfigProps = {
  title?: string | [string, string];
  state?: t.MainImmutable;
  useStateController?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

/**
 * Component
 */
export type MainArgsCardProps = {
  ctrl?: C;
  size?: t.SizeTuple;
  title?: boolean | { left?: string; right?: string };
  argv?: string;
  focused?: { cmdbar?: boolean };
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

/**
 * Immutable Wrapper
 */
export type MainImmutable = t.ImmutableRef<
  t.MainProps,
  t.ImmutableEvents<t.MainProps, t.PatchOperation>,
  t.PatchOperation
>;
