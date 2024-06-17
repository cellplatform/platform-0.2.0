import { Pkg } from './common';

export { Icons } from '../Icons';
export * from '../common';

export const DEFAULTS = {
  displayName: {
    player: `${Pkg.name}.VimeoPlayer`,
    background: `${Pkg.name}.Background`,
  },
} as const;
