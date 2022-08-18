/**
 * Walks an object tree implementing a visitor callback for each item.
 */
export declare function walk(obj: any | any[], fn: (obj: any | any[]) => void): void;
/**
 * Builds an object from the given path
 * (shallow or a period seperated deep path).
 */
export declare function build<T>(keyPath: string, root: {
    [key: string]: any;
}, value?: any): T;
/**
 * Walks the given (period seperated) key-path to retrieve a value.
 */
export declare function pluck<T>(keyPath: string, root: {
    [key: string]: any;
}): T;
/**
 * Remove values from the given object.
 */
export declare function remove(keyPath: string, root: {
    [key: string]: any;
}, options?: {
    type?: 'LEAF' | 'PRUNE';
}): {
    [key: string]: any;
};
/**
 * Prunes values on the given priod seperated key-path from an object.
 */
export declare function prune(keyPath: string, root: {
    [key: string]: any;
}): {
    [key: string]: any;
};
/**
 * Converts an object into an array of {key,value} pairs.
 */
export declare function toArray<T = Record<string, unknown>, K = keyof T>(obj: Record<string, any>): {
    key: K;
    value: T[keyof T];
}[];
