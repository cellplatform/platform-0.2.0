import type { t } from './common';

/**
 * <Component>
 */
export type InfoStatefulProps = Omit<t.InfoProps, 'data'> & {
  data?: InfoStatefulData | t.InfoData;
  onReady?: InfoStatefulReadyHandler;
};

/**
 * Data
 */
type D = t.InfoData;
type P = unknown;
type E = t.ImmutableEvents<D, P>;
export type InfoStatefulData = t.ImmutableRef<D, P, E>;

/**
 * Events
 */
export type InfoStatefulReadyHandler = (e: InfoStatefulReadyHandlerArgs) => void;
export type InfoStatefulReadyHandlerArgs = {
  repos: t.InfoRepos;
  data: InfoStatefulData;
  dispose$: t.Observable<void>;
};
