import { type t, IndexedDb } from './common';

export const TestIndexedDb = {
  name: 'dev.test',
  IndexedDb,

  /**
   * Delete test databases.
   */
  async delete(options: { root?: boolean } = {}) {
    const databases = await IndexedDb.list();
    const names = databases.map((db) => db.name);

    console.group('🌳 Delete');
    for (const name of names) {
      if (name?.startsWith('dev.test.') || (options.root && name === 'dev.test')) {
        const res = await IndexedDb.delete(name);
        console.log(`• ${res.name}`, res.error ? `ERROR ${res.error}` : '');
      }
    }
    console.groupEnd();
  },
} as const;
