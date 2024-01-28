export type * from './Doc/t';
export type * from './Doc.Lens/t';
export type * from './Doc.Lens.NEXT/t';
export type * from './Doc.Namespace/t';
export type * from './Doc.Namespace.NEXT/t';

export type * from './Store.Index/t';
export type * from './Store/t';

export type * from './Store.Web.Index/t';
export type * from './Store.Web.IndexDb/t';
export type * from './Store.Web/t';

export type * from './ui/ui.Info/t';
export type * from './ui/ui.RepoList.Model/t';
export type * from './ui/ui.RepoList.Virtual/t';
export type * from './ui/ui.RepoList/t';

/**
 * Automerge JS object extensions.
 */
export interface AutomergeArray<T> extends Array<T> {
  deleteAt(index: number, total?: number): void;
  insertAt(index: number, ...items: T[]): void;
}
