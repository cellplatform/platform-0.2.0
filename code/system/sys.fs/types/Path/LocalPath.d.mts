/**
 * Helpers for working with paths on a [local] file-system implementation.
 */
export declare const LocalPath: {
    /**
     * Convert a value to an absolute path.
     */
    toAbsolutePath(args: {
        path: string;
        root: string;
    }): string;
    /**
     * Convert a valuew to a relative path, using the home ("~") character.
     */
    toRelativePath(args: {
        path: string;
        root: string;
    }): string;
    /**
     * Convert a path to a location field value.
     */
    toAbsoluteLocation(args: {
        path: string;
        root: string;
    }): string;
    /**
     * Convert a path to a relative location, using the home ("~") character.
     */
    toRelativeLocation(args: {
        path: string;
        root: string;
    }): string;
};
