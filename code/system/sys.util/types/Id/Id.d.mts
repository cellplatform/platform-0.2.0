declare const cuid: (size?: number | undefined) => string;
declare const slug: () => string;
export declare const Id: {
    /**
     * Creates long collision-resistant long identifier.
     */
    cuid: (size?: number | undefined) => string;
    /**
     * Creates a short sequental identifier.
     * IMPORTANT
     *    [[DO NOT]] put "slugs" into databases as keys.
     *    Use the long "cuid" for that.
     */
    slug: () => string;
};
export { slug, cuid };
