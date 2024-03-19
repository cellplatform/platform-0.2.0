import { type t } from './common';
export * from '../common';

/**
 * Convert a DocRef → DocRefHandle.
 */
export function asHandle<T>(doc: t.DocRef<T>) {
  return (doc as t.DocRefHandle<T>).handle;
}

/**
 * Constants
 */
const meta: t.DocMeta = {};

export const DEFAULTS = {
  message: { initial: 'initial' },
  timeout: { get: 1500 },
  initial: { meta },
} as const;
