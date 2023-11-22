export * from '../common/t';
import { type t } from './common';

export type SampleEdge = {
  kind: 'Left' | 'Right';
  repo: t.RepoListModel;
  network: t.WebrtcStore;
};
