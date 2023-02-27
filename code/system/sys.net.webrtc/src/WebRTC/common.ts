import type { t } from '../common.t';
export * from '../common';

/**
 * Constants
 */
export const DEFAULT = {
  get mediaKinds(): t.PeerMediaStreamInput[] {
    return ['camera', 'screen'];
  },
};
