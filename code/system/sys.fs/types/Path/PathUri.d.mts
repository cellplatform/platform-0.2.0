/**
 * A string URI that represents the path to a file.
 * Example:
 *
 *    "path:foo/bar.png"
 *
 */
export declare const PathUri: {
    prefix: string;
    /**
     * Determines if the given string is a "path:" URI.
     */
    is(input?: string): boolean;
    /**
     * Retrieves the path from the given URI.
     */
    path(input?: string): string | undefined;
    /**
     * Ensures the given string is trimmed and has "path:" as a prefix
     */
    ensurePrefix(path: string): string;
    /**
     * Remotes the "path:" prefix from the given string.
     */
    trimPrefix(path: string): string;
};
