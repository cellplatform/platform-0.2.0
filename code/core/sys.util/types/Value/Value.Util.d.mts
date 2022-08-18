/**
 * Deletes undefined keys from an object (clone).
 */
export declare function deleteUndefined<T extends Record<string, unknown>>(obj: T): T;
/**
 * Deletes empty keys from an object (clone).
 */
export declare function deleteEmpty<T extends Record<string, unknown>>(obj: T): T;
/**
 * Determines whether an HTTP status is OK.
 */
export declare const isStatusOk: (status: number) => boolean;
/**
 * A singular/plural display string.
 */
export declare function plural(count: number, singular: string, plural?: string): string;
