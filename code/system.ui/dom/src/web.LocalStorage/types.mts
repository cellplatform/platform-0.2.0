import { type t } from '../common.t';

export type LocalStorageChange<T extends t.JsonMapU> =
  | LocalStoragePut<T>
  | LocalStorageDelete<T>
  | LocalStorageClear;

export type LocalStoragePut<T extends t.JsonMapU> = { kind: 'put'; key: keyof T; value: t.JsonU };
export type LocalStorageDelete<T extends t.JsonMapU> = { kind: 'delete'; key: keyof T };
export type LocalStorageClear = { kind: 'clear' };

export type LocalStorage<T extends t.JsonMapU> = {
  prefix: string;
  changed$: t.Observable<LocalStorageChange<T>>;
  get<K extends keyof T>(key: K, defaultValue: T[K]): T[K];
  put<K extends keyof T>(key: K, value: T[K]): T[K];
  delete<K extends keyof T>(key: K): void;
  clear(): void;
  object(initial: T): T;
};
