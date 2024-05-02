import type { t } from './common';
export type * from '../ui/common/t';

export type SampleEdge = {
  kind: t.NetworkConnectionEdgeKind;
  model: t.RepoListModel;
  network: t.NetworkStore;
};

export type TestCtx = {
  left: t.NetworkStore;
  right: t.NetworkStore;
  useExistingConnections: boolean;
  connect(direction?: 'L2R' | 'R2L'): Promise<void>;
  disconnect(force?: boolean): Promise<void>;
};
