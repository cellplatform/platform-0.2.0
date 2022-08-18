/**
 * Value conversion and interpretation helpers.
 */
export declare const Value: {
    toNumber(value: any): any;
    toBool(value: any, defaultValue?: boolean | undefined): boolean | undefined;
    toType<T>(value: any): number | boolean | T | null | undefined;
};
