const DEFAULTS = {
  mimetype: 'application/octet-stream',
};

/**
 * Helpers for working with binary files in the browser.
 */
export const File = {
  DEFAULTS,

  toBlob(data: Uint8Array, mimetype: string = DEFAULTS.mimetype) {
    return new Blob([data], { type: mimetype });
  },
} as const;
