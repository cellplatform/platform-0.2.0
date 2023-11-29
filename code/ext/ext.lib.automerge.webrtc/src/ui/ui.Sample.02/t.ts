export * from '../common/t';
import { type t } from './common';

export type SampleEdge = {
  kind: t.ConnectionEdgeKind;
  repo: t.RepoListModel;
  network: t.WebrtcStore;
};
