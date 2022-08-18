/**
 * Returns a copy of the array with falsey values removed.
 * Removes:
 *   - null
 *   - undefined
 *   - empty-string ('')
 */
export declare function compact<T>(list: T[]): T[];
/**
 * Converts a nested set of arrays into a flat single-level array.
 */
export declare function flatten<T>(list: any): T[];
/**
 * Ensures a value is an array.
 */
export declare function asArray<T>(input: T | T[]): T[];
