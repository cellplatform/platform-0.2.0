export { expect, expectError } from 'sys.test';
export { describe, it } from 'vitest';
export * from '../common/index.mjs';

/**
 * Tauri
 */
import { mockIPC } from '@tauri-apps/api/mocks';
export const TestTauri = {
  mockIPC,
};
