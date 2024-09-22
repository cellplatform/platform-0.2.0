import type { t } from '../common.ts';

export type TimeLib = {
  delay(msecs: t.Msecs, fn?: TimeDelayCallback): t.TimeDelayPromise;
  delay(next?: TimeDelayCallback): t.TimeDelayPromise;
};

/**
 * Timout/Delay
 */
export type TimeDelayCallback = () => void;
export type TimeDelayPromise = Promise<void> & {
  readonly is: { readonly cancelled: boolean; readonly completed: boolean; readonly done: boolean };
  readonly timeout: t.Msecs;
  cancel(): void;
};
