const DEFAULTS = {
  mimetype: 'application/octet-stream',
};

/**
 * Helpers for working with binary files in the browser.
 */
export const File = {
  DEFAULTS,

  /**
   * Convert a [Uint8Array] to a [Blob].
   */
  toBlob(data: Uint8Array, mimetype: string = DEFAULTS.mimetype) {
    return new Blob([data], { type: mimetype });
  },

  /**
   * Read a Blob/File object into a [Uint8Array].
   */
  toUint8Array(input: Blob | File) {
    return new Promise<Uint8Array>((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (result === null) throw new Error('File reader returned null');
          if (typeof result === 'string') return resolve(new TextEncoder().encode(result));
          if (typeof result === 'object') return resolve(new Uint8Array(result));
        };
        reader.readAsArrayBuffer(input);
      } catch (error) {
        reject(error);
      }
    });
  },
} as const;
