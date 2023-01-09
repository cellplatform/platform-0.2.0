import { t } from './common';

type O = Record<string, unknown>;

/**
 * Dynamic value.
 *    Used within the definitions of [DevTools] implementations
 *    when the value needs to be re-calculated upon state/prop updates.
 */
export type DevValueHandler<R, S extends O = O> = (e: DevValueHandlerArgs<S>) => R;
export type DevValueHandlerArgs<S extends O = O> = { state: S; props: t.DevRenderProps };
