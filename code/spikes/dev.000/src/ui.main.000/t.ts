import type { t } from '../common';

type O = Record<string, unknown>;
export type RootCommands = 'me' | 'dev' | 'cast' | 'hash' | 'cmd';

/**
 * Shell
 */
export type Shell = {
  readonly cmd: ShellCommands;
  readonly state: {
    readonly me: t.Doc;
    readonly cmdbar: t.Lens;
    readonly harness: t.Lens;
    readonly tmp: t.Lens<Tmp>;
  };
};

export type Tmp = {
  props?: Record<string, unknown>;
  video?: TmpVideo;
};
export type TmpVideo = { id: string; playing?: boolean; muted?: boolean };

/**
 * Shell Commands
 */
export type ShellCommands = {
  cmdbar?: t.CmdBarRef;
  readonly fc: t.Cmd<t.FarcasterCmd>;
};

/**
 * Editor
 */
export type ShellEditorController = t.Lifecycle;
