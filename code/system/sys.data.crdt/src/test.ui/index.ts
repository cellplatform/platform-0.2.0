import { TestFilesystem } from 'sys.fs';
import { type t } from '../common';

export { expect, expectError } from 'sys.test';
export { Test, Tree } from 'sys.test.spec';
export { Dev } from 'sys.ui.react.common';
export { TestFilesystem };

export { Automerge, Crdt, toObject } from '../index.mjs';
export * from '../ui/common';
export * from './ConnectionMock.mjs';

/**
 * Retrieve a file-system (safe to run on node AND/OR browser)
 */
export async function getTestFilesystem(bus?: t.EventBus<any>) {
  const { dev } = await import('sys.fs.indexeddb');
  const { TestFilesystem } = await dev();
  return TestFilesystem.client(bus);
}
