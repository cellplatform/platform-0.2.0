import { IndexedDb, StoreIndexDb } from './common';

/**
 * DevHarness "Spec" databases.
 */
export const SpecDb = {
  name: 'dev.spec',
  IndexedDb,

  async deleteDatabases() {
    await IndexedDb.delete(SpecDb.name);
    await IndexedDb.delete(StoreIndexDb.name(SpecDb.name));
  },
} as const;

/**
 * Unit-test databases.
 */
export const TestDb = {
  name: 'dev.test',
  IndexedDb,
  Spec: SpecDb,

  async deleteDatabases() {
    await IndexedDb.delete(TestDb.name);
    await IndexedDb.delete(StoreIndexDb.name(TestDb.name));
  },
} as const;
