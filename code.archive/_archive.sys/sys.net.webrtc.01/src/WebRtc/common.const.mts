import type { t } from '../common.t';

export const DEFAULTS = {
  get mediaKinds(): t.PeerMediaStreamSource[] {
    return ['camera', 'screen'];
  },
};
