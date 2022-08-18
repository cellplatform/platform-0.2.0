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
/**
 * Filter an array with an asynchronous predicate.
 */
export declare function asyncFilter<T>(list: T[], predicate: (value: T) => Promise<boolean>): Promise<T[]>;
