import type { t } from '../common.t';

export type CrdtRepo = t.Lifecycle & {
  readonly kind: 'Crdt:Repo';
};
