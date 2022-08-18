import * as t from './types.mjs';
export declare type IDurationOptions = {
    round?: number;
};
export declare class Duration implements t.TimeDuration {
    static create(msec: number, options?: IDurationOptions): t.TimeDuration;
    static to: {
        sec: (msec: number, precision?: number) => number;
        min: (msec: number, precision?: number) => number;
        hour: (msec: number, precision?: number) => number;
        day: (msec: number, precision?: number) => number;
        date: (input: t.DateInput) => Date;
    };
    static format(msec: number, unit: t.TimeUnit, round?: number): string;
    static parse(input: string | number, options?: IDurationOptions): t.TimeDuration;
    /**
     * [Lifecycle]
     */
    private constructor();
    /**
     * [Fields]
     */
    readonly msec: number;
    private readonly round;
    /**
     * [Properties]
     */
    get ok(): boolean;
    get sec(): number;
    get min(): number;
    get hour(): number;
    get day(): number;
    /**
     * [Methods]
     */
    toString(unit?: t.TimeUnit | {
        unit?: t.TimeUnit;
        round?: number;
    }): string;
}
