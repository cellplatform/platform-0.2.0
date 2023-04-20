import { rx, t, Is } from '../common';
import { TestFilesystem } from 'sys.fs';

export { expect, expectError } from 'sys.test';
export { Test, Tree } from 'sys.test.spec';
export { TestFilesystem };

export * from '../ui/common';
export { Crdt, toObject, Automerge } from '../index.mjs';

/**
 * Retrieve a file-system (safe to run on node AND/OR browser)
 */
export async function getTestFs(bus: t.EventBus<any>) {
  // NodeJS (UI tests running in CI)
  if (Is.env.nodejs) return TestFilesystem.memory({ bus }).fs;

  // Browser.
  const { Filesystem } = await import('sys.fs.indexeddb');
  return (await Filesystem.client({ bus })).fs;
}

/**
 * In-memory bus connection.
 */
export function ConnectionMock() {
  const a = { bus: rx.bus() };
  const b = { bus: rx.bus() };
  const conn = rx.bus.connect([a.bus, b.bus]);
  const dispose = () => conn.dispose();
  return { a, b, dispose };
}
