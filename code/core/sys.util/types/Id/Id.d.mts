export declare function generate(): string;
export declare const Id: {
    /**
     * Creates a short non-sequental identifier.
     *    Wrapper around the `shortid` NPM module.
     *    https://www.npmjs.com/package/shortid
     */
    slug(): string;
    /**
     * Creates a CUID (collision-resistant id).
     *    Wrapper around the `cuid` NPM module.
     *    https://github.com/ericelliott/cuid
     */
    cuid(): string;
};
export declare const id: {
    /**
     * Creates a short non-sequental identifier.
     *    Wrapper around the `shortid` NPM module.
     *    https://www.npmjs.com/package/shortid
     */
    slug(): string;
    /**
     * Creates a CUID (collision-resistant id).
     *    Wrapper around the `cuid` NPM module.
     *    https://github.com/ericelliott/cuid
     */
    cuid(): string;
};
