import { type t } from '../common';
import { Is as base } from 'sys.test.spec';

export const Is = {
  ...base,

  ctx(input: any) {
    if (input === null || typeof input !== 'object') return false;
    const subject = input as t.DevCtx;
    return (
      typeof subject['toObject'] === 'function' &&
      typeof subject['run'] === 'function' &&
      typeof subject['state'] === 'function' &&
      typeof subject['component'] === 'object' &&
      typeof subject['host'] === 'object' &&
      typeof subject['debug'] === 'object'
    );
  },
};
