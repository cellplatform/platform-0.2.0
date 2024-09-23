import type { t } from '../common.ts';
import * as lib from './u.rx.libs.ts';

import { Is } from './u.rx.Is.ts';
import { disposable, done, lifecycle } from './u.rx.lifecycle.ts';
import { event, payload } from './u.rx.payload.ts';

/**
 * Tools for working with Observables (via the [rxjs] library).
 */
export const rx: t.RxLib = {
  ...lib,
  Is,
  noop$: new lib.Subject(),

  done,
  lifecycle,
  disposable,

  event,
  payload,
  subject<T>() {
    return new lib.Subject<T>();
  },
};

export const Rx = rx;
