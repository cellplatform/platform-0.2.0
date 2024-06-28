import type { t } from '../common';

export type CommandAction = 'me' | 'dev' | 'cast';

export type MainCmd = {
  readonly fc: t.Cmd<t.FarcasterCmd>;
  readonly cmdbar: t.CmdBarCtrl;
};

export type Main = {
  readonly me: t.Doc;
  readonly cmd: MainCmd;
  readonly lens: { readonly cmdbar: t.Lens };
};