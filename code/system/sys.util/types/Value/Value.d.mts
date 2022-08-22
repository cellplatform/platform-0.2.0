import * as object from './Value.Object.mjs';
/**
 * Value conversion and interpretation helpers.
 */
export declare const Value: {
    plural(count: number, singular: string, plural?: string | undefined): string;
    isStatusOk: (status: number) => boolean;
    round(value: number, precision?: number): number;
    random(min?: number, max?: number | undefined): number;
    compact<T>(list: T[]): T[];
    flatten<T_1>(list: any): T_1[];
    asArray<T_2>(input: T_2 | T_2[]): T_2[];
    asyncFilter<T_3>(list: T_3[], predicate: (value: T_3) => Promise<boolean>): Promise<T_3[]>;
    toNumber(value: any): any;
    toBool(value: any, defaultValue?: boolean | undefined): boolean | undefined;
    toType<T_4>(value: any): number | boolean | T_4 | null | undefined;
    object: typeof object;
};
