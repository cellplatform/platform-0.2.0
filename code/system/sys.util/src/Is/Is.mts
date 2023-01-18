import type * as t from './types.mjs';

const REGEX = {
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
} as const;

/**
 * Environment flags.
 */
export const Is: t.Is = {
  env: {
    get browser() {
      return typeof window !== 'undefined';
    },

    get nodejs() {
      return typeof process !== 'undefined' && typeof process?.versions?.node === 'string';
    },
  },

  /**
   * Determine if the given input is an Observable.
   */
  observable(input?: any) {
    return typeof input === 'object' && typeof input?.subscribe === 'function';
  },

  /**
   * Determine if the given input is an observable Subject.
   */
  subject(input?: any) {
    return Is.observable(input) && typeof input?.next === 'function';
  },

  /**
   * Determine if the given input is a node stream
   */
  stream(input?: any) {
    return typeof input?.on === 'function';
  },

  /**
   * Determines whether the given value is a Promise.
   */
  promise(value?: any) {
    return value ? typeof value === 'object' && typeof value.then === 'function' : false;
  },

  /**
   * Determines whether the value is a simple object (ie. not a class instance).
   */
  plainObject(value?: any): boolean {
    if (typeof value !== 'object' || value === null) return false;

    // Not plain if it has a modified constructor.
    const ctr = value.constructor;
    if (typeof ctr !== 'function') return false;

    // If has modified prototype.
    if (typeof ctr.prototype !== 'object') return false;

    // If the constructor does not have an object-specific method.
    const hasOwnPropery = ctr.prototype.hasOwnProperty('isPrototypeOf'); // eslint-disable-line
    if (hasOwnPropery === false) return false;

    // Finish up.
    return true;
  },

  /**
   * A safe way to test any value as to wheather is is 'blank'
   * meaning it can be either:
   *   - null
   *   - undefined
   *   - empty-string ('')
   *   - empty-array ([]).
   */
  blank(value?: any) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.filter((v) => !Is.blank(v)).length === 0) return true;
    return false;
  },

  /**
   * Determines whether the given value is a number, or can be
   * parsed into a number.
   *
   * NOTE: Examines string values to see if they are numeric.
   */
  numeric(value: any | string | number) {
    if (Is.blank(value)) {
      return false;
    }
    const num = parseFloat(value);
    if (num === undefined) {
      return false;
    }
    if (num.toString().length !== value.toString().length) {
      return false;
    }
    return !Number.isNaN(num);
  },

  /**
   * Determines whether the given value is a JSON string.
   */
  json(value?: any) {
    if (typeof value !== 'string') return false;
    value = value.trim();
    return value.startsWith('{') || value.startsWith('[');
  },

  /**
   * Determind if the given value represents an email address.
   * NOTES:
   *    General Email Regex (RFC 5322 Official Standard)
   *    Source: https://www.emailregex.com/ (Jan 2023)
   */
  email(value?: any) {
    if (typeof value !== 'string') return false;
    return Boolean(value.match(REGEX.EMAIL));
  },
};
