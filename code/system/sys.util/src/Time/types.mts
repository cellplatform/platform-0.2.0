import type { ConfigType, Dayjs } from 'dayjs';
import type { Observable } from 'rxjs';
import type { t } from '../common.t';

export type TimeDuration = {
  readonly ok: boolean;
  readonly msec: number;
  readonly sec: number;
  readonly min: number;
  readonly hour: number;
  readonly day: number;
  toString(unit?: TimeUnit | { unit?: TimeUnit; round?: number }): string;
};

export type TimeUnit = 'msec' | 'ms' | 'sec' | 's' | 'min' | 'm' | 'hour' | 'h' | 'day' | 'd';

export type TimeDelay<T = any> = (msecs: t.Msecs, callback?: () => T) => TimeDelayPromise<T>;
export type TimeDelayPromise<T = any> = Promise<T> & {
  readonly id: NodeJS.Timeout;
  readonly result: T | undefined;
  readonly isCancelled: boolean;
  cancel(): void;
};
export type TimeDelayActionFactory = (msecs: t.Msecs, fn: TimeDelayActionFn) => TimeDelayAction;
export type TimeDelayActionReason = 'start' | 'reset' | 'restart' | 'complete';
export type TimeDelayActionFn = (e: TimeDelayActionFnArgs) => any;
export type TimeDelayActionFnArgs = { action: TimeDelayActionReason; elapsed: t.Msecs };
export type TimeDelayAction = {
  readonly running: boolean;
  readonly elapsed: t.Msecs;
  start(): void;
  reset(): void;
  complete(): void; // Force complete.
};

export type TimeWait = (msecs: t.Msecs | Observable<any>) => Promise<unknown>;
export type TimeElapsed = (
  from: DateInput,
  options?: { to?: DateInput; round?: number },
) => TimeDuration;
export type DayFactory = (config?: ConfigType) => Dayjs;

export type DateInput = number | string | Date | Dayjs;

export type Time = {
  readonly delay: TimeDelay;
  readonly wait: TimeWait;
  readonly action: TimeDelayActionFactory;
  readonly elapsed: TimeElapsed;
  readonly day: DayFactory;
  readonly now: DateTime;
  readonly timezone: string;
  until(until$?: t.UntilObservable): TimeUntil;
  utc(input?: Date | number): DateTime;
  timer(start?: Date, options?: { round?: number }): Timer;
  duration(msec: number | string, options?: { round?: number }): TimeDuration;
};

export type DateTime = {
  readonly date: Date;
  readonly timestamp: number;
  readonly unix: number;
  format(template?: string): string;
};

export type Timer = {
  readonly startedAt: Date;
  readonly elapsed: TimeDuration;
  reset: () => Timer;
};

export type TimeUntil = {
  readonly delay: TimeDelay;
  readonly disposed: boolean;
};
