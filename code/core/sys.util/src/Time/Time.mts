import day from 'dayjs';

import { delay, wait } from './Delay.mjs';
import { elapsed, timer } from './Timer.mjs';
import { utc } from './Utc.mjs';
import { ITime } from './types.mjs';
import { Duration } from './Duration.mjs';

export * from './types.mjs';

export const time: ITime = {
  day,
  delay,
  wait,
  timer,
  elapsed,
  utc,
  get timezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  },
  get now() {
    return utc();
  },
  duration(msec: number | string, options: { round?: number } = {}) {
    const { round } = options;
    return typeof msec === 'string'
      ? Duration.parse(msec, { round })
      : Duration.create(msec, { round });
  },
};
