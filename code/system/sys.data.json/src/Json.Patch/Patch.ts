import {
  applyPatches,
  createDraft,
  enablePatches,
  finishDraft,
  isDraft,
  original,
  produceWithPatches,
} from 'immer';

import { type t } from '../common';

type O = Record<string, unknown>;

if (typeof enablePatches === 'function') enablePatches();

/**
 * Convert a draft (proxied instance) object into a simple object.
 *
 * See: https://immerjs.github.io/immer/docs/original
 */
export function toObject<T extends O>(input: any): T {
  return isDraft(input) ? (original<T>(input) as T) : input;
}

/**
 * Patch
 * Standard:
 *    RFC-6902 JSON patch standard
 *    https://tools.ietf.org/html/rfc6902
 *
 *    This subset of `op` values is what the [immer] state library uses.
 *    https://github.com/immerjs/immer
 *
 */
export const Patch: t.Patch = {
  toObject,

  toPatchSet(forward, backward) {
    return {
      prev: backward ? toPatches(backward) : [],
      next: forward ? toPatches(forward) : [],
    };
  },

  isEmpty(input) {
    return input === null || typeof input !== 'object'
      ? true
      : isEmptyArray(input.prev) && isEmptyArray(input.next);
  },

  isProxy(input) {
    return isDraft(input);
  },

  change<T extends O>(from: T, fn: t.PatchMutation<T> | T) {
    if (typeof fn === 'function') {
      const [to, forward, backward] = produceWithPatches<T>(from, (draft) => {
        const ctx: t.PatchMutationCtx = { toObject };
        fn(draft as T, ctx);
        return undefined; // NB: No return value (to prevent replacement).
      });
      const patches = Patch.toPatchSet(forward, backward);
      const op: t.PatchOperationKind = 'update';
      return { op, from, to: to as T, patches };
    } else {
      const [to, forward, backward] = produceWithPatches<T>(from, () => fn as any);
      const patches = Patch.toPatchSet(forward, backward);
      const op: t.PatchOperationKind = 'replace';
      return { op, from, to: to as T, patches };
    }
  },

  async changeAsync<T extends O>(from: T, fn: t.PatchMutationAsync<T>) {
    const draft = createDraft(from) as T;
    const ctx: t.PatchMutationCtx = { toObject };
    await fn(draft, ctx);

    let patches: t.PatchSet = { prev: [], next: [] };
    const to = finishDraft(draft, (next, prev) => (patches = Patch.toPatchSet(next, prev))) as T;

    const op: t.PatchOperationKind = 'update';
    return { op, from, to, patches };
  },

  apply<T extends O>(from: T, patches: t.PatchOperation[] | t.PatchSet) {
    const changes = (Array.isArray(patches) ? patches : patches.next).map(toArrayPatch);
    return applyPatches(from, changes);
  },
};

/**
 * [Helpers]
 */

const isEmptyArray = (input: any) => (Array.isArray(input) ? input.length === 0 : true);

const toArrayPatch = (input: t.PatchOperation): t.ArrayPatch => {
  const path = input.path.split('/').map((part) => {
    const number = parseFloat(part);
    return isNaN(number) ? part : number;
  });
  const op = input.op;
  const value = (input as any).value;
  return { op, path, value };
};

const toPatch = (input: t.ArrayPatch): t.PatchOperation => {
  const hasForwardSlash = input.path.some((part) => {
    return typeof part === 'string' ? part.includes('/') : false;
  });

  if (hasForwardSlash) {
    const path = input.path
      .map((part) => (typeof part === 'string' ? `'${part}'` : part))
      .join(',');
    const err = `Property names cannot contain the "/" character. op: '${input.op}' path: [${path}]`;
    throw new Error(err);
  }

  return { ...input, path: input.path.join('/') };
};

const toPatches = (input: t.ArrayPatch | t.ArrayPatch[]): t.PatchOperation[] => {
  const patches = Array.isArray(input) ? input : [input];
  return patches.filter((p) => Boolean(p)).map((p) => toPatch(p));
};
