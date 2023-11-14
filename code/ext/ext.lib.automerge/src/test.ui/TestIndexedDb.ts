import { IndexedDb, StoreIndexDb } from './common';

/**
 * DevHarness "Spec" databases.
 */
export const SpecDb = {
  name: 'dev.spec',
  IndexedDb,
  async deleteDatabases() {
    await deleteDatabase(SpecDb.name);
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
    await deleteDatabase(TestDb.name);
    await deleteDatabase('dev.test.IndexDb');
  },
} as const;

/**
 * Helpers
 */
export async function deleteDatabase(name: string) {
  await IndexedDb.delete(name);
  await IndexedDb.delete(StoreIndexDb.name(name));
}
