import type { t } from './common';

type O = Record<string, unknown>;

export type CrdtFuncLens = t.CrdtLens<{}, CrdtFuncData>;
export type CrdtFuncData = {
  count: t.AutomergeCounter;
  params: O;
};

export type CrdtFuncHandler = (args: CrdtFuncHandlerArgs) => any;
export type CrdtFuncHandlerArgs = {
  readonly count: number;
  readonly params: O;
};

export type CrdtFunc<P extends {}> = t.Lifecycle & {
  readonly kind: 'Crdt:Func';
  run(params: P): void;
};
