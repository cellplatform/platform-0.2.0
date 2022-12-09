import { slug, Time } from '../common';

const ext = '.log.json';

export const ContentLogFilename = {
  ext,

  isMatch(path: string) {
    return String(path).trim().endsWith(ext);
  },

  create(version: string = '0.0.0') {
    const now = Time.now.timestamp;
    const tx = slug();
    return `${now}.${tx}-${version}${ext}`;
  },
};
