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
type E = t.ImmutableEvents<D, unknown>;
export type InfoStatefulData = t.ImmutableRef<D, E>;

/**
 * Events
 */
export type InfoStatefulReadyHandler = (e: InfoStatefulReadyHandlerArgs) => void;
export type InfoStatefulReadyHandlerArgs = { data: InfoStatefulData; dispose$: t.Observable<void> };
