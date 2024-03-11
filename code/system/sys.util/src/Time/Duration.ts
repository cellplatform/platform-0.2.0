import { round } from '../Value/Value.Math';
import { toNumber } from '../Value/Value.To';
import { day, type t } from './common';

const MSEC = 1;
const SEC = MSEC * 1000;
const MIN = SEC * 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;

export type DurationOptions = { round?: number };

export class Duration implements t.TimeDuration {
  public static create(msec: number, options?: DurationOptions) {
    return new Duration(msec, options) as t.TimeDuration;
  }

  public static to = {
    sec: (msec: number, precision?: number) => round(msec / 1000, precision),
    min: (msec: number, precision?: number) => round(msec / 1000 / 60, precision),
    hour: (msec: number, precision?: number) => round(msec / 1000 / 60 / 60, precision),
    day: (msec: number, precision?: number) => round(msec / 1000 / 60 / 60 / 24, precision),
    date: (input: t.DateInput) => day(input).toDate(),
  };

  public static format(msec: number, unit: t.TimeUnit, round = 0) {
    const to = Duration.to;
    switch (unit) {
      case 'ms':
      case 'msec':
        return `${msec}ms`;

      case 's':
      case 'sec':
        return `${to.sec(msec, round)}s`;

      case 'm':
      case 'min':
        return `${to.min(msec, round)}m`;

      case 'h':
      case 'hour':
        return `${to.hour(msec, round)}h`;

      case 'd':
      case 'day':
        return `${to.day(msec, round)}d`;

      default:
        throw new Error(`Unit '${unit}' not supported `);
    }
  }

  public static parse(input: string | number, options: DurationOptions = {}) {
    const done = (msecs: number) => Duration.create(msecs, options);

    if (typeof input === 'number') {
      return done(input);
    }

    // Extract number.
    input = (input || '').trim();
    const matchedDigits = input.match(/(\d*\.?)\d*/);
    const digits = matchedDigits && matchedDigits[0] ? toNumber(matchedDigits[0]) : -1;
    if (digits < 0) {
      return done(-1);
    }

    // Extract and multiply by unit (sec, min, hour, day).
    input = input.substring(digits.toString().length).trim().toLowerCase();

    switch (input) {
      case '':
      case 'ms':
      case 'msec':
        return done(digits); // NB: no multiplier (default unit)

      case 's':
      case 'sec':
        return done(digits * SEC);

      case 'm':
      case 'min':
        return done(digits * MIN);

      case 'h':
      case 'hour':
        return done(digits * HOUR);

      case 'd':
      case 'day':
        return done(digits * DAY);

      default:
        return done(-1); // NB: Unit is invalid.
    }
  }

  /**
   * [Lifecycle]
   */
  private constructor(msec: number, options: DurationOptions = {}) {
    this.msec = msec < 0 ? -1 : msec;
    this.round = options.round === undefined ? 1 : options.round;
  }

  /**
   * [Fields]
   */
  public readonly msec: number;
  private readonly round: number;

  /**
   * [Properties]
   */

  public get ok() {
    return this.msec >= 0;
  }

  public get sec() {
    return Duration.to.sec(this.msec, this.round);
  }

  public get min() {
    return Duration.to.min(this.msec, this.round);
  }

  public get hour() {
    return Duration.to.hour(this.msec, this.round);
  }

  public get day() {
    return Duration.to.day(this.msec, this.round);
  }

  /**
   * [Methods]
   */

  public toString(unit?: t.TimeUnit | { unit?: t.TimeUnit; round?: number }) {
    const msecs = this.msec;
    const format = Duration.format;
    const options = typeof unit === 'object' ? unit : { unit };
    const round = typeof options.round === 'number' ? options.round : 0;

    if (options.unit !== undefined) {
      return format(msecs, options.unit, round);
    }
    if (msecs < SEC) {
      return format(msecs, 'ms', round);
    }
    if (msecs < MIN) {
      return format(msecs, 's', round);
    }
    if (msecs < HOUR) {
      return format(msecs, 'm', round);
    }
    if (msecs < DAY) {
      return format(msecs, 'h', round);
    }
    return format(msecs, 'd', round);
  }
}
