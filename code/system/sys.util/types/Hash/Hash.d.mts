export declare type HashOptions = {
    asString?: (input?: any) => string;
    prefix?: boolean;
};
export declare const Hash: {
    /**
     * Generate a self-describing SHA256 hash of the given object.
     */
    sha256(input: any, options?: HashOptions): string;
    /**
     * Convert an input for hashing to a [Uint8Array].
     */
    toBytes(input: any, options?: HashOptions): Uint8Array;
};
