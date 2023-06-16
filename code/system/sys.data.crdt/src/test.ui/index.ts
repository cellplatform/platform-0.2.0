import { TestFilesystem } from 'sys.fs';
import { Is, rx, type t } from '../common';

export { expect, expectError } from 'sys.test';
export { Test, Tree } from 'sys.test.spec';
export { Dev } from 'sys.ui.react.common';
export { TestFilesystem };

export { Automerge, Crdt, toObject } from '../index.mjs';
export * from '../ui/common';

/**
 * Retrieve a file-system (safe to run on node AND/OR browser)
 */
export async function getTestFs(bus: t.EventBus<any>) {
  // NodeJS (UI tests running in CI)
  const id = 'fs.dev';
  if (Is.env.nodejs) return TestFilesystem.memory({ bus, id }).fs;

  // Browser.
  const { Filesystem } = await import('sys.fs.indexeddb');
  return (await Filesystem.client({ bus, id })).fs;
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
