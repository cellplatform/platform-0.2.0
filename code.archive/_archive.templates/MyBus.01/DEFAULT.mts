import { Pkg, t } from './common';

export const DEFAULT = {
  get info(): t.MyInfo {
    const { name = '', version = '' } = Pkg;
    const info: t.MyInfo = { module: { name, version } };
    return info;
  },
} as const;
