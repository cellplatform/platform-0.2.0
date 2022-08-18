/// <reference types="node" />
import { Observable } from 'rxjs';
import { Dayjs, ConfigType } from 'dayjs';
export declare type IDuration = {
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
}) => IDuration;
export declare type DayFactory = (config?: ConfigType) => Dayjs;
export declare type DateInput = number | string | Date | Dayjs;
export declare type ITime = {
    delay: TimeDelay;
    wait: TimeWait;
    elapsed: TimeElapsed;
    day: DayFactory;
    now: IDate;
    timezone: string;
    utc(input?: Date | number): IDate;
    timer(start?: Date, options?: {
        round?: number;
    }): ITimer;
    duration(msec: number | string, options?: {
        round?: number;
    }): IDuration;
};
export declare type IDate = {
    date: Date;
    timestamp: number;
    unix: number;
    format(template?: string): string;
};
export declare type ITimer = {
    startedAt: Date;
    reset: () => ITimer;
    elapsed: IDuration;
};
