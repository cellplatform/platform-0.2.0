import type { t } from '../common';

type O = Record<string, unknown>;
export type CommandAction = 'me' | 'dev' | 'cast' | 'hash';

/**
 * Shell
 */

export type Shell = {
  readonly cmd: ShellCommands;
  readonly state: {
    readonly me: t.Doc;
    readonly cmdbar: t.Lens;
  };
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

export type TmpVideoParams = { id: string; playing: boolean };
export type TmpPropsParams = { items: O };
