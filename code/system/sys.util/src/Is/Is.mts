import type * as t from './types.mjs';

/**
 * Environment flags.
 */
export const Is: t.Is = {
  get browser() {
    return typeof window !== 'undefined';
  },

  get node() {
    return (
      typeof process !== 'undefined' && process.versions != null && process.versions.node != null
    );
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
};
