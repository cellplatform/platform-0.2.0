import type { t } from '../common';

export type CommandAction = 'me' | 'dev' | 'cast';

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
  readonly fc: t.Cmd<t.FarcasterCmd>;
  readonly cmdbar: t.CmdBarCtrl;
};

/**
 * Editor
 */
export type ShellEditorController = t.Lifecycle;
