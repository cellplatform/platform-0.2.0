import type { t } from '../common.ts';
import { event, payload } from './rx.payload.ts';
import { Is } from './rxjs.Is.ts';
import * as lib from './rxjs.lib.ts';

export const rx: t.RxLib = {
  ...lib,
  Is,
  noop$: new lib.Subject(),
  event,
  payload,
  subject<T>() {
    return new lib.Subject<T>();
  },
};

export const Rx = rx;
