import { type t } from './common';

/**
 * Flag helpers for Immutable objects.
 */
export const Is = {
  immutable<D, P = unknown>(input: any): input is t.Immutable<D, P> {
    if (!isObject(input)) return false;
    const o = input as t.Immutable<D, P>;
    return isObject(o.current) && areFuncs(o.change);
  },

  immutableRef<D, E = unknown, P = unknown>(input: any): input is t.ImmutableRef<D, E, P> {
    if (!isObject(input)) return false;
    const o = input as t.ImmutableRef<D, E, P>;
    return Is.immutable(o) && typeof o.instance === 'string' && areFuncs(o.events);
  },
} as const;

/**
 * Helpers
 */
function isObject(input: any) {
  return input !== null && typeof input === 'object';
}

function areFuncs(...input: any[]) {
  return input.every((v) => typeof v === 'function');
}
