import { DEFAULTS, type t } from './common';

/**
 * Helpers
 */
export const Util = {
  srcAsBinary(input?: t.ImageProps['src']): t.ImageBinary | undefined {
    if (!input) return undefined;
    return typeof input === 'object' ? input : undefined;
  },

  dropOverBlur(input?: t.ImageDropSettings) {
    return input?.blur ?? DEFAULTS.drop.blur;
  },

  dropOverContent(input?: t.ImageDropSettings) {
    return input?.content ?? DEFAULTS.drop.content;
  },

  warningBlur(input?: t.ImageWarningSettings) {
    return input?.blur ?? DEFAULTS.warning.blur;
  },

  warningDelay(input?: t.ImageWarningSettings) {
    return input?.delay ?? DEFAULTS.warning.delay;
  },

  isSupportedMimetype(mimetype: string) {
    return DEFAULTS.supportedMimetypes.includes(mimetype as t.ImageSupportedMimetypes);
  },

  notSupportedMessage(mimetype: string = 'Unknown') {
    return `File type '${mimetype}' is not supported.`;
  },
} as const;
