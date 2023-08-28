/**
 * AUDIT NOTES
 *   Crypto libraries mirror the desgin decisions made
 *   by @v on the [@farcaster/hub-web] library.
 *
 *      circa: May 2023
 *      https://github.com/farcasterxyz/hub-monorepo/tree/main/packages/hub-web
 *
 *  */
import { sha256 } from '@noble/hashes/sha256';
import { sha1 } from '@noble/hashes/sha1';
import { R } from '../common';
import { shortenHash, ShortenHashOptions } from '../Value/Value.Hash.mjs';

export type HashOptions = {
  asString?: (input?: any) => string;
  prefix?: boolean;
};

export const Hash = {
  /**
   * Generate a self-describing SHA1 hash of the given input.
   *
   * NOTE:
   *    This is not cryptographically secure.
   *    It is however useful for generating hashes on files that for
   *    de-duping where cryptographic security is not required.
   *
   */
  sha1(input: any, options: HashOptions = {}) {
    const { prefix = true } = options;
    const bytes = Hash.toBytes(input, options);
    const hash = Hash.toHex(sha1(bytes));
    return hash && prefix ? `sha1-${hash}` : hash;
  },

  /**
   * Generate a self-describing SHA256 hash of the given input.
   */
  sha256(input: any, options: HashOptions = {}) {
    const { prefix = true } = options;
    const bytes = Hash.toBytes(input, options);
    const hash = Hash.toHex(sha256(bytes));
    return hash && prefix ? `sha256-${hash}` : hash;
  },

  /**
   * Convert an input for hashing to a [Uint8Array].
   */
  toBytes(input: any, options: HashOptions = {}) {
    if (input instanceof Uint8Array) return Uint8Array.from(input);

    const text = (options.asString ?? R.toString)(input);
    const bytes = new TextEncoder().encode(text);
    return Uint8Array.from(bytes);
    // return bytes;
  },

  /**
   * Convert a bytes array to a hex string.
   */
  toHex(bytes: Uint8Array): string {
    let output = '';
    for (let i = 0; i < bytes.length; i++) {
      const hex = bytes[i].toString(16).padStart(2, '0');
      output += hex;
    }
    return output;
  },

  /**
   * Shorten a hash for display.
   */
  shorten(hash: string, length: number | [number, number], options?: ShortenHashOptions) {
    return shortenHash(hash, length, options);
  },
};
