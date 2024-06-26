import type { t } from '../common';
export type * from '../common/t';

export type MainCmd = {
  readonly fc: t.Cmd<t.FarcasterCmd>;
  readonly cmdbar: t.CmdBarCtrl;
};

export type Main = {
  readonly me: t.DocRef;
  readonly cmd: MainCmd;
  readonly lens: { readonly cmdbar: t.Lens };
};
