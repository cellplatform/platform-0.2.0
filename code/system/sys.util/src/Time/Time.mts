import day from 'dayjs';

import { delay, wait } from './Delay.mjs';
import { elapsed, timer } from './Timer.mjs';
import { utc } from './Utc.mjs';
import type * as t from './types.mjs';
import { Duration } from './Duration.mjs';

const Time: t.Time = {
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

export { Time, Time as time };
