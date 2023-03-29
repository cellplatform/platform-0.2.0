import type { t } from '../../common.t';

export type MonacoCrdtSyncer<D extends {}> = t.Disposable & {
  readonly kind: 'crdt:monaco:syncer';
  readonly editor: t.MonacoCodeEditor;
  readonly doc: t.CrdtDocRef<D>;
  readonly disposed: boolean;
};
