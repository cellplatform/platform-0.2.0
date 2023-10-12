import type { t } from './common';

/**
 * Store (a repository of documents) that runs on the browser.
 */
export type WebStore = Omit<t.Store, 'kind'> & {
  kind: 'crdt:store.web';
  Provider(props: { children?: React.ReactNode }): JSX.Element;
};
