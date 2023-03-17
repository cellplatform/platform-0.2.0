import type { t } from '../common.t';

export const DEFAULTS = {
  get mediaKinds(): t.PeerMediaStreamInput[] {
    return ['camera', 'screen'];
  },
};
