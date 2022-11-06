import { Path } from '../common/';

export const CrdtPath = {
  format(input: string) {
    input = (input || '').trim();

    const parts = Path.parts(input);
    const dir = parts.dir;
    const base = CrdtPath.trimExtension(parts.filename);

    const filename = {
      base,
      crdt: `${base}.crdt`,
      json: `${base}.crdt.json`,
    };

    const api = {
      dir,
      filename,
      toString(options: { json?: boolean } = {}) {
        const name = options.json ? filename.json : filename.crdt;
        return Path.join(dir, name);
      },
    };

    return api;
  },

  trimExtension(path: string) {
    return path.replace(/\.json$/, '').replace(/\.crdt$/, '');
  },
};
