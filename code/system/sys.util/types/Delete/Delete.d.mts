/**
 * Helpers for deleting values and fields.
 */
export declare const Delete: {
    /**
     * Deletes undefined keys from an object (clone).
     */
    undefined<T extends Record<string, unknown>>(obj: T): T;
    /**
     * Deletes empty keys from an object (clone).
     */
    empty<T_1 extends Record<string, unknown>>(obj: T_1): T_1;
};
