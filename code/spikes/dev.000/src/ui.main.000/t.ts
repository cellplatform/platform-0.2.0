import type { t } from '../common';

type O = Record<string, unknown>;
export type CommandAction = 'me' | 'dev' | 'cast' | 'hash' | 'cmd';

/**
 * Shell
 */
export type Shell = {
  readonly cmd: ShellCommands;
  readonly state: {
    readonly me: t.Doc;
    readonly cmdbar: t.Lens;
    readonly tmp: t.Lens<Tmp>;
  };
};

export type Tmp = {
  cmd?: t.CmdObject<TmpCmds>;
  props?: Record<string, unknown>;
  video?: TmpVideoParams;
};

/**
 * Shell Commands
 */
export type ShellCommands = {
  cmdbar?: t.CmdBarRef;
  readonly fc: t.Cmd<t.FarcasterCmd>;
  readonly tmp: t.Cmd<TmpCmds>;
};

/**
 * Editor
 */
export type ShellEditorController = t.Lifecycle;

/**
 * TODO 🐷
 */
export type TmpCmds = TmpMeShare | TmpVideo | TmpProps;
type TmpMeShare = t.CmdType<'tmp:share', { text: string }>;
type TmpVideo = t.CmdType<'tmp:video', TmpVideoParams>;
type TmpProps = t.CmdType<'tmp:props', TmpPropsParams>;

export type TmpVideoParams = { id: string; playing?: boolean; muted?: boolean };
export type TmpPropsParams = { items: O };
