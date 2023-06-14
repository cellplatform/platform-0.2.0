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

  focusedBlur(input?: t.ImagePasteSettings) {
    return input?.focusedBlur ?? DEFAULTS.paste.focusedBlur;
  },

  focusedContent(input?: t.ImagePasteSettings) {
    return input?.focusedContent ?? DEFAULTS.paste.focusedContent;
  },
};
