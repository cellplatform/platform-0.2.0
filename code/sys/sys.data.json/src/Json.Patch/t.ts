import type * as t from '../common/t';

type O = Record<string, unknown>;

export type PatchOperationKind = 'update' | 'replace';
export type PatchMutation<T extends O> = (draft: T, ctx: PatchMutationCtx) => void;
export type PatchMutationAsync<T extends O> = (draft: T, ctx: PatchMutationCtx) => Promise<void>;
export type PatchMutationCtx = {
  toObject<T extends O>(input: any): T;
};

/**
 * Inline copy of the `immer` Patch type.
 */
export type ArrayPatch = {
  op: PatchOperation['op'];
  path: (string | number)[];
  value?: any;
};

type A = t.ArrayPatch;

export type Patch = {
  toObject<T extends O>(input: any): T;
  toPatchSet(forward?: A | A[], backward?: A | A[]): t.PatchSet;
  isEmpty(patches: t.PatchSet): boolean;
  isProxy(value: any): boolean;
  change<T extends O>(from: T, fn: t.PatchMutation<T> | T): t.PatchChange<T>;
  changeAsync<T extends O>(from: T, fn: t.PatchMutationAsync<T>): Promise<t.PatchChange<T>>;
  apply<T extends O>(from: T, patches: t.PatchOperation[] | t.PatchSet): T;
};

export type PatchChangeHandler<T extends O> = (e: t.PatchChange<T>) => void;
export type PatchChange<T extends O> = {
  before: T;
  after: T;
  op: PatchOperationKind;
  patches: t.PatchSet;
};

/**
 * A set of patches that allow for forward and backward transformations on data.
 */
export type PatchSet = { prev: PatchOperation[]; next: PatchOperation[] };

/**
 * Patch
 *
 * Standard:
 *    RFC-6902 JSON patch standard
 *    https://tools.ietf.org/html/rfc6902
 *
 *    This subset of `op` values is what the [immer] state library uses.
 *    https://github.com/immerjs/immer
 *
 */
export type PatchOperation = PatchOperationAdd | PatchOperationRemove | PatchOperationReplace;

export type PatchOperationAdd = { op: 'add'; path: string; value?: any };
export type PatchOperationRemove = { op: 'remove'; path: string };
export type PatchOperationReplace = { op: 'replace'; path: string; value?: any };

/**
 * NB: Part of the standard (RFC-6902) but not used. *
 */
// export type PatchOperationMove = { op: 'move'; path: string; from: string };
// export type PatchOperationCopy = { op: 'copy'; path: string; from: string };
// export type PatchOperationTest = { op: 'test'; path: string; value?: any };
