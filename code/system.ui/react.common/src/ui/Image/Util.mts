import { DEFAULTS, type t } from './common';

/**
 * Helpers
 */
export const Util = {
  dropOverBlur(input?: t.ImageDropSettings) {
    return input?.overBlur ?? DEFAULTS.drop.overBlur;
  },

  dropOverContent(input?: t.ImageDropSettings) {
    return input?.overContent ?? DEFAULTS.drop.overContent;
  },
};
