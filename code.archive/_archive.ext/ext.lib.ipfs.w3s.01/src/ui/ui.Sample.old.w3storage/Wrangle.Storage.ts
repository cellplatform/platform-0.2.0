import type { Web3Storage, Upload } from 'web3.storage';

export type FileText = string;
export type FilePath = string;

export const Storage = {
  async import(token: string = '') {
    const { Web3Storage } = await import('web3.storage');
    return new Web3Storage({ token });
  },

  async list(store: Web3Storage) {
    const res: Upload[] = [];
    const list = store.list();
    for await (const item of list) res.push(item);
    return res;
  },

  textToFile(text: FileText, path: FilePath) {
    const binary = new TextEncoder().encode(text);
    return new File([binary], path, { type: 'text/plain' });
  },

  async put(store: Web3Storage, dir: string, ...files: [FileText, FilePath][]) {
    const list = files.map(([text, path]) => Storage.textToFile(text, path));
    await store.put(list, { name: dir });
  },
} as const;
