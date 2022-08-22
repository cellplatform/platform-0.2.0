export declare const Path: {
    /**
     * Join multiple parts into a single "/" delimited path.
     * NB:
     *    This is a re-implementation of the native `join` method
     *    to allow this module to have no dependencies on platform node 'fs'.
     */
    join(...segments: string[]): string;
    /**
     * Trim whitespace.
     */
    trim: typeof trim;
    /**
     * Trims slashes from the start (left) of a string.
     */
    trimSlashesStart(input: string): string;
    /**
     * Trims slashes from the start (left) of a string.
     */
    trimSlashesEnd(input: string): string;
    /**
     * Trims slashes from the start (left) of a string.
     */
    trimSlashes(input: string): string;
    /**
     * Ensures the path ends in a single "/".
     */
    ensureSlashEnd(input: string): string;
    /**
     * Remove http/https prefix.
     */
    trimHttp(input: string): string;
    /**
     * Removes a trailing `/*` wildcard glob pattern.
     */
    trimWildcardEnd(input: string): string;
    /**
     * Break a path into it's constituent parts.
     */
    parts(input: string): {
        dir: string;
        filename: string;
        name: string;
        ext: string;
        path: string;
    };
};
/**
 * [Helpers]
 */
declare function trim(input: any): string;
export {};
