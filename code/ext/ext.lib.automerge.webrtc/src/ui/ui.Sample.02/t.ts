export * from '../common/t';
import { type t } from './common';

export type Edge = 'Left' | 'Right';
export type SampleEdge = { peer: t.PeerModel; repo: t.RepoListModel };
