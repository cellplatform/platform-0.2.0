import { Is as base } from 'sys.ui.react.dev';
import type { t } from '../common';

type O = Record<string, unknown>;
const { ctx } = base;

export const Is = {
  ctx,

  dev<T extends O>(input: any): input is t.DevTools<T> {
    if (input === null || typeof input !== 'object') return false;
    const obj = input as t.DevTools;
    return (
      typeof obj.TODO === 'function' &&
      typeof obj.button === 'function' &&
      typeof obj.boolean === 'function' &&
      typeof obj.hr === 'function' &&
      typeof obj.section === 'function' &&
      typeof obj.title === 'function' &&
      Is.ctx(input.ctx)
    );
  },
} as const;
