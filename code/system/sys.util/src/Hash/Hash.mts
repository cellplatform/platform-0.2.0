import * as AsmCrypto from 'asmcrypto.js';
import { R } from '../common/index.mjs';

export type HashOptions = {
  asString?: (input?: any) => string;
  prefix?: boolean;
};

export const Hash = {
  /**
   * Generate a self-describing SHA256 hash of the given object.
   */
  sha256(input: any, options: HashOptions = {}) {
    const { prefix = true } = options;

    const algorithm = new AsmCrypto.Sha256();
    const bytes = Hash.toBytes(input, options);
    const result = algorithm.process(bytes).finish().result;
    const hash = result ? AsmCrypto.bytes_to_hex(result) : '';

    return hash && prefix ? `sha256-${hash}` : hash;
  },

  /**
   * Generate a self-descriving SHA1 hash of the given object.
   */
  sha1(input: any, options: HashOptions = {}) {
    const { prefix = true } = options;

    const algorithm = new AsmCrypto.Sha1();
    const bytes = Hash.toBytes(input, options);
    const result = algorithm.process(bytes).finish().result;
    const hash = result ? AsmCrypto.bytes_to_hex(result) : '';

    return hash && prefix ? `sha1-${hash}` : hash;
  },

  /**
   * Convert an input for hashing to a [Uint8Array].
   */
  toBytes(input: any, options: HashOptions = {}) {
    if (input instanceof Uint8Array) return input;
    return AsmCrypto.string_to_bytes((options.asString ?? R.toString)(input));
  },
};

/**
 * Helpers
 */
