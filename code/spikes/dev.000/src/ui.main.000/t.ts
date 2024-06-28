import type { t } from '../common';

export type CommandAction = 'me' | 'dev' | 'cast' | 'hash';

/**
 * Shell
 */

export type Shell = {
  readonly cmd: ShellCommands;
  readonly state: {
    readonly me: t.Doc;
    readonly cmdbar: t.Lens;
    readonly tmp: t.Lens;
  };
};

/**
 * Shell Commands
 */
export type ShellCommands = {
  readonly cmdbar: t.CmdBarCtrl;
  readonly fc: t.Cmd<t.FarcasterCmd>;
  readonly tmp: t.Cmd<TmpCmds>;
};

/**
 * Editor
 */
export type ShellEditorController = t.Lifecycle;

export type TmpCmds = EditorShare;
type EditorShare = t.CmdType<'editor:share', { text: string }>;
