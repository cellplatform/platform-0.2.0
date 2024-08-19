import type { t } from '../common';

type Copy = 'copy' | 'cp';
type Video = 'video' | 'v';
export type RootCommands = 'dev' | 'me' | 'crdt' | 'cmd' | 'fc' | 'hash' | 'new.tab' | Video | Copy;

/**
 * Shell
 */
export type Shell = {
  cmdbar?: t.CmdBarRef;
  readonly self: t.PeerModel;
  readonly fc: t.Cmd<t.FarcasterCmd>;
  readonly state: ShellState;
  readonly repo: ShellRepos;
};

export type ShellState = {
  readonly me: t.Doc;
  readonly cmdbar: t.Lens;
  readonly harness: t.Lens<Harness>;
  readonly tmp: t.Lens<Tmp>;
};

export type ShellRepo = { store: t.Store; index: t.StoreIndex };
export type ShellRepos = {
  readonly fs: ShellRepo;
  readonly tmp: ShellRepo;
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
