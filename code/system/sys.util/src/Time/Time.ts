import { delay, wait, action } from './Delay';
import { Duration } from './Duration';
import { elapsed, timer } from './Timer';
import { until } from './Until';
import { utc } from './Utc';
import { day, type t } from './common';

const Time: t.Time = {
  day,
  delay,
  wait,
  action,
  timer,
  elapsed,
  utc,
  until,
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
