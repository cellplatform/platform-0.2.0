import type { t } from './common';

export type CrdtRepo = t.Lifecycle & {
  readonly kind: 'Crdt:Repo';
};
