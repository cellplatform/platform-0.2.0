import type { t } from '../common';

type O = Record<string, unknown>;
export type RootCommands = 'me' | 'dev' | 'cast' | 'hash' | 'cmd';

/**
 * Shell
 */
export type Shell = {
  cmdbar?: t.CmdBarRef;
  readonly cmd: ShellCommands;
  readonly state: {
    readonly me: t.Doc;
    readonly cmdbar: t.Lens;
    readonly harness: t.Lens<Harness>;
    readonly tmp: t.Lens<Tmp>;
  };
};

/**
 * State: DevHarness
 */
export type Harness = {
  debugVisible?: boolean;
};

/**
 * State: Smp
 */
export type Tmp = {
  props?: Record<string, unknown>;
  video?: TmpVideo;
};
export type TmpVideo = { id: string; playing?: boolean; muted?: boolean };

/**
 * Shell Commands
 */
export type ShellCommands = {
  readonly fc: t.Cmd<t.FarcasterCmd>;
};

/**
 * Editor
 */
export type ShellEditorController = t.Lifecycle;
