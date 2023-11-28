import { TestDb as Base } from 'ext.lib.automerge';

const edge = (kind: 'Left' | 'Right', name: string) => {
  return {
    kind,
    name,
    async deleteDatabase() {
      await Base.deleteDatabase(name);
    },
  } as const;
};

export const EdgeSampleDb = {
  left: edge('Left', 'dev.sample.left'),
  right: edge('Right', 'dev.sample.right'),
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
} as const;
