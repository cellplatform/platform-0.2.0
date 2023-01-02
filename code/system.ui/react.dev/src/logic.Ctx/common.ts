import { t } from '../common';

export * from '../common';
export { DEFAULT } from '../DEFAULT.mjs';

/**
 * Internal types.
 */
export type PropArgs = {
  current: () => t.DevRenderProps;
  changed: () => void;
};
