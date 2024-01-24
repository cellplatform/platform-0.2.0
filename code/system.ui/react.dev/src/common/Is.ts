import { type t } from '../common';
import { Is as base } from 'sys.test.spec';

export const Is = {
  ...base,

  nil(input?: any) {
    return input === undefined || input === null;
  },

  ctx(input: any) {
    if (input === null || typeof input !== 'object') return false;
    const obj = input as t.DevCtx;
    return (
      typeof obj['toObject'] === 'function' &&
      typeof obj['run'] === 'function' &&
      typeof obj['state'] === 'function' &&
      typeof obj['subject'] === 'object' &&
      typeof obj['host'] === 'object' &&
      typeof obj['debug'] === 'object'
    );
  },
};
