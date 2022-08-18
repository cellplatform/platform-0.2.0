/**
 * JSON (Javascript Object Notation).
 *  - https://www.json.org/json-en.html
 *  - https://devblogs.microsoft.com/typescript/announcing-typescript-3-7-beta
 */
export declare type Json = string | number | boolean | null | undefined | JsonMap | Json[];
export declare type JsonMap = {
    [property: string]: Json;
};
