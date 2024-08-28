import type { t } from './common';

/**
 * <Component>
 */
export type InfoStatefulProps = Omit<t.InfoProps, 'data'> & {
  data?: InfoStatefulData | t.InfoData;
  onReady?: InfoStatefulReadyHandler;
};

export type InfoStatefulData = t.ImmutableRef<t.InfoData>;

/**
 * Events
 */
export type InfoStatefulReadyHandler = (e: InfoStatefulReadyHandlerArgs) => void;
export type InfoStatefulReadyHandlerArgs = { data: InfoStatefulData };
