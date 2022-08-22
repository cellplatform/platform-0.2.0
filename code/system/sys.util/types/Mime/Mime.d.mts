/**
 * Helpers for working with MIME types.
 */
export declare class Mime {
    static toType: import("./types.mjs").ToMimetype;
    /**
     * Determine if the given MIME type represents a binary file.
     */
    static isBinary(mimetype: string): boolean;
    /**
     * Determine if the given MIME type represents a text file.
     */
    static isText(mimetype: string): boolean;
    /**
     * Determine if the given MIME type represents json.
     */
    static isJson(mimetype: string): boolean;
}
