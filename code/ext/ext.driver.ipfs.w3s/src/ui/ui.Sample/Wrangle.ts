import type { Web3File, Web3Response } from 'web3.storage';
import { type t } from './common';

/**
 * Wrangle URL
 */
export const Url = {
  cid(cid: string) {
    return `https://${cid}.ipfs.w3s.link`;
  },

  name(cid: string, name?: string) {
    if (!name) return Url.cid(cid);
    return `https://${cid}.ipfs.w3s.link/${name}`;
  },
} as const;

/**
 * Wrangle Helpers
 */
export const Wrangle = {
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
