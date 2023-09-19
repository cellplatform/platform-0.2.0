import type { Web3File, Web3Response } from 'web3.storage';
import { Storage } from './Wrangle.Storage';
import { Url } from './Wrangle.Url';
import { type t } from './common';

export { Storage, Url };

/**
 * Wrangle URL
 */

/**
 * Wrangle Helpers
 */
export const Wrangle = {
  Storage,
  Url,

  async toFiles(res?: Web3Response | null) {
    if (!res) return [];
    return (await res.files()).map((file) => Wrangle.toFile(file));
  },

  toFile(file: Web3File): t.SampleFile {
    const { cid, name: path, size: bytes, lastModified: modified } = file;
    return { cid, path, bytes, modified };
  },
} as const;
