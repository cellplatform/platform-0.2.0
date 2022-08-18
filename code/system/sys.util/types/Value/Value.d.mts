import * as object from './Value.Object.mjs';
/**
 * Value conversion and interpretation helpers.
 */
export declare const Value: {
    deleteUndefined<T extends Record<string, unknown>>(obj: T): T;
    deleteEmpty<T_1 extends Record<string, unknown>>(obj: T_1): T_1;
    plural(count: number, singular: string, plural?: string | undefined): string;
    isStatusOk: (status: number) => boolean;
    round(value: number, precision?: number): number;
    random(min?: number, max?: number | undefined): number;
    compact<T_2>(list: T_2[]): T_2[];
    flatten<T_3>(list: any): T_3[];
    asArray<T_4>(input: T_4 | T_4[]): T_4[];
    toNumber(value: any): any;
    toBool(value: any, defaultValue?: boolean | undefined): boolean | undefined;
    toType<T_5>(value: any): number | boolean | T_5 | null | undefined;
    object: typeof object;
};
