import { TestDb as Base } from 'ext.lib.automerge';
import { type t, DevReload } from './common';

const edge = (kind: t.NetworkConnectionEdgeKind, name: string) => {
  return {
    kind,
    name,
    async deleteDatabase() {
      await Base.deleteDatabase(name);
    },
  } as const;
};

export const EdgeSampleDb = {
  name: 'tmp.sample',
  left: edge('Left', 'tmp.sample.left'),
  right: edge('Right', 'tmp.sample.right'),
  edge(kind: t.NetworkConnectionEdgeKind) {
    if (kind === 'Left') return EdgeSampleDb.left;
    if (kind === 'Right') return EdgeSampleDb.right;
    throw new Error(`Edge "${kind}" not supported`);
  },
  async deleteDatabases() {
    await EdgeSampleDb.left.deleteDatabase();
    await EdgeSampleDb.right.deleteDatabase();
  },
};

export const TestDb = {
  ...Base,
  EdgeSample: EdgeSampleDb,
  async deleteDatabases() {
    await Base.deleteDatabases();
    await EdgeSampleDb.deleteDatabases();
  },
  DevReload,
} as const;
