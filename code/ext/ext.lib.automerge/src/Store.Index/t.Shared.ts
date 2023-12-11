import type { A } from './common';

type Uri = string;
type UriInput = Uri | Uri[];

/**
 * Record of the share/publish status of the document.
 */
export type StoreIndexItemShared = {
  current: boolean;
  version: A.Counter;
};

/**
 * Method for toggling the shared status of an indexed document.
 */
export type StoreIndexToggleShared = (
  uri: UriInput,
  options?: { value?: boolean },
) => StoreIndexToggleSharedResponse[];
export type StoreIndexToggleSharedResponse = { uri: Uri; shared: boolean; version: number };
