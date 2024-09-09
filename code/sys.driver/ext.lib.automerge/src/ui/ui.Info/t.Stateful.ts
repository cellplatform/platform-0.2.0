import type { t } from './common';

/**
 * <Component>
 */
export type InfoStatefulProps = Omit<t.InfoProps, 'data'> & {
  data?: InfoStatefulData | t.InfoData;
  onReady?: InfoStatefulReadyHandler;
  onChange?: InfoStatefulOnChangedHandler;
};

/**
 * State: (useStateful)
 */
export type InfoStatefulController = {
  fields: t.InfoField[];
  props: t.InfoProps;
  handlers: t.InfoPropsHandlers;
  data?: t.InfoData;
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

export type InfoStatefulOnChangedHandler = (e: InfoStatefulOnChangedHandlerArgs) => void;
export type InfoStatefulOnChangedHandlerArgs = { before: t.InfoData; after: t.InfoData };
