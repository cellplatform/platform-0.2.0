/// <reference types="node" />
import type { Observable } from 'rxjs';
import type { Dayjs, ConfigType } from 'dayjs';
export declare type TimeDuration = {
    ok: boolean;
    msec: number;
    sec: number;
    min: number;
    hour: number;
    day: number;
    toString(unit?: TimeUnit | {
        unit?: TimeUnit;
        round?: number;
    }): string;
};
export declare type TimeUnit = 'msec' | 'ms' | 'sec' | 's' | 'min' | 'm' | 'hour' | 'h' | 'day' | 'd';
export declare type TimeDelay<T = any> = (msecs: number, callback?: () => T) => TimeDelayPromise<T>;
export declare type TimeDelayPromise<T = any> = Promise<T> & {
    id: NodeJS.Timeout;
    isCancelled: boolean;
    cancel(): void;
    result: T | undefined;
};
export declare type TimeWait = (msecs: number | Observable<any>) => Promise<unknown>;
export declare type TimeElapsed = (from: DateInput, options?: {
    to?: DateInput;
    round?: number;
}) => TimeDuration;
export declare type DayFactory = (config?: ConfigType) => Dayjs;
export declare type DateInput = number | string | Date | Dayjs;
export declare type Time = {
    delay: TimeDelay;
    wait: TimeWait;
    elapsed: TimeElapsed;
    day: DayFactory;
    now: DateTime;
    timezone: string;
    utc(input?: Date | number): DateTime;
    timer(start?: Date, options?: {
        round?: number;
    }): Timer;
    duration(msec: number | string, options?: {
        round?: number;
    }): TimeDuration;
};
export declare type DateTime = {
    date: Date;
    timestamp: number;
    unix: number;
    format(template?: string): string;
};
export declare type Timer = {
    startedAt: Date;
    reset: () => Timer;
    elapsed: TimeDuration;
};
