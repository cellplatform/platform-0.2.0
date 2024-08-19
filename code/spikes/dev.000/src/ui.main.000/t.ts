import type { t } from '../common';

type Copy = 'copy' | 'cp';
type Video = 'video' | 'v';
export type RootCommands =
  | 'dev'
  | 'me'
  | 'crdt'
  | 'cmd'
  | 'fc'
  | 'hash'
  | 'new.tab'
  | 'new.window'
  | Video
  | Copy;

/**
 * Shell
 */
export type Shell = {
  cmdbar?: t.CmdBarRef;
  readonly self: t.PeerModel;
  readonly fc: t.Cmd<t.FarcasterCmd>;
  readonly state: ShellState;
  readonly repo: ShellRepo;
};

export type ShellState = {
  readonly me: t.Doc;
  readonly cmdbar: t.Lens;
  readonly harness: t.Lens<Harness>;
  readonly tmp: t.Lens<Tmp>;
};

type R = { store: t.Store; index: t.StoreIndex };
export type ShellRepo = {
  readonly fs: R;
  readonly tmp: R;
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
 * Editor
 */
export type ShellEditorController = t.Lifecycle;
