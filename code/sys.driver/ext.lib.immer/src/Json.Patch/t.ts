import type { t } from '../common';

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
  op: t.PatchOperation['op'];
  path: t.ObjectPath;
  value?: any;
};

type A = ArrayPatch;

export type PatchTool = {
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
  tx?: t.IdString;
};

/**
 * A set of patches that allow for forward and backward transformations on data.
 */
export type PatchSet = { prev: t.PatchOperation[]; next: t.PatchOperation[] };
