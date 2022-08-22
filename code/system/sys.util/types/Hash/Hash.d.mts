export declare type HashOptions = {
    asString?: (input?: any) => string;
};
export declare const Hash: {
    /**
     * Generate a self-describing SHA256 hash of the given object.
     */
    sha256(input: any, options?: HashOptions): string;
};
