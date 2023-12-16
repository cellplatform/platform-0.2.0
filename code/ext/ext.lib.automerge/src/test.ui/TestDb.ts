import { IndexedDb, StoreIndexDb } from './common';
import { Reload } from './Reload';

export async function deleteDatabase(name: string) {
  const index = StoreIndexDb.name(name);
  console.info(`💥 DELETING: ${name}...`);
  console.info(`💥 DELETING: ${index}...`);

  await IndexedDb.delete(name);
  await IndexedDb.delete(index);

  console.info(`🐷 DELETED: ${name}`);
  console.info(`🐷 DELETED: ${index}`);
}

/**
 * DevHarness "Spec" databases.
 */
export const SpecDb = {
  name: 'tmp.spec',
  deleteDatabase: () => deleteDatabase(SpecDb.name),
} as const;

export const UnitDb = {
  name: 'tmp.test',
  deleteDatabase: () => deleteDatabase(UnitDb.name),
} as const;

export const IndexDb = {
  name: 'tmp.test.IndexDb',
  deleteDatabase: () => deleteDatabase(IndexDb.name),
} as const;

/**
 * Unit-test databases.
 */
export const TestDb = {
  Spec: SpecDb,
  Unit: UnitDb,
  Index: IndexDb,
  deleteDatabase,
  async deleteDatabases() {
    await SpecDb.deleteDatabase();
    await UnitDb.deleteDatabase();
    await IndexDb.deleteDatabase();
  },
  UI: { Reload },
} as const;
