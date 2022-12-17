import { Is as base } from 'sys.util';

export const Is = {
  ...base,

  ctx(input: any) {
    if (input === null) return false;
    if (typeof input !== 'object') return false;
    return (
      typeof input.toObject === 'function' &&
      typeof input.run === 'function' &&
      typeof input.reset === 'function' &&
      typeof input.state === 'function' &&
      typeof input.component === 'object' &&
      typeof input.host === 'object' &&
      typeof input.debug === 'object'
    );
  },
};
