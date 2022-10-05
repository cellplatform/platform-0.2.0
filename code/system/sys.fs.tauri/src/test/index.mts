export { expect, expectError } from 'sys.test';
export { describe, it } from 'vitest';
export { TestFilesystem } from 'sys.fs';

export * from '../common/index.mjs';

/**
 * Tauri
 */
import { mockIPC } from '@tauri-apps/api/mocks';
export const TestTauri = {
  mockIPC,
};
