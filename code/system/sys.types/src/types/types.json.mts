/**
 * JSON (Javascript Object Notation).
 *  - https://www.json.org/json-en.html
 *  - https://devblogs.microsoft.com/typescript/announcing-typescript-3-7-beta
 */
export type Json = string | number | boolean | null | JsonMap | Json[];
export type JsonMap = { [property: string]: Json };

/**
 * An extended version of JSON that supports [undefined].
 */
export type JsonU = string | number | boolean | null | JsonMapU | JsonU[] | undefined;
export type JsonMapU = { [property: string]: JsonU };
