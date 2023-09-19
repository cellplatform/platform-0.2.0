import type { Web3File, Web3Response } from 'web3.storage';
import { Storage } from './Wrangle.Storage';
import { Url } from './Wrangle.Url';
import { Hash, type t } from './common';

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

  async toFiles(res: Web3Response | null) {
    if (!res) return [];
    const files = (await res.files()).map((file) => Wrangle.toFile(file));
    return files;
  },

  toFile(file: Web3File): t.SampleFile {
    const { cid, name: path, size: bytes, lastModified: modified } = file;
    return { cid, path, bytes, modified };
  },

  toDisplayFiles(files: t.SampleFile[]) {
    return files.map(Wrangle.toDisplayFile);
  },

  toDisplayFile(file: t.SampleFile): t.SampleFile {
    return {
      ...file,
      cid: Hash.shorten(file.cid, 5),
    };
  },
} as const;
