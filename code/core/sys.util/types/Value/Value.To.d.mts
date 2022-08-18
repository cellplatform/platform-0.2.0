/**
 * Converts a value to a number if possible.
 */
export declare function toNumber(value: any): any;
/**
 * Converts a value to boolean (if it can).
 */
export declare function toBool(value: any, defaultValue?: boolean): boolean | undefined;
/**
 * Converts a string to it's actual type if it can be derived.
 */
export declare function toType<T>(value: any): number | boolean | T | null | undefined;
