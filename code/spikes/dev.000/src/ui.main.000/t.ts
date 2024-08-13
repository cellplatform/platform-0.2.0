import type { t } from '../common';

type Copy = 'copy' | 'cp';
type Video = 'video' | 'v';
export type RootCommands =
  | 'me'
  | 'dev'
  | 'fc'
  | 'hash'
  | 'cmd'
  | 'crdt'
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
  readonly state: {
    readonly me: t.Doc;
    readonly cmdbar: t.Lens;
    readonly harness: t.Lens<Harness>;
    readonly tmp: t.Lens<Tmp>;
  };
  readonly repo: {
    fs: { store: t.Store; index: t.StoreIndex };
    tmp: { store: t.Store; index: t.StoreIndex };
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
 * Editor
 */
export type ShellEditorController = t.Lifecycle;
