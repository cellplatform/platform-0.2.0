import { CONTINUE, EXIT, SKIP } from 'unist-util-visit';

export * from '../common.mjs';

/**
 * Helpers
 */
export const CONTINUATION = { SKIP, CONTINUE, EXIT };

export function isContinuation(value: any) {
  return value === SKIP || value === CONTINUE || value === EXIT;
}
