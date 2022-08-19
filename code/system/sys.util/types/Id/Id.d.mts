declare const cuid: (size?: number | undefined) => string;
declare const slug: (size?: number | undefined) => string;
export declare const Id: {
    /**
     * Creates long collision-resistant long identifier.
     */
    cuid: (size?: number | undefined) => string;
    /**
     * Creates a short non-sequental identifier.
     */
    slug: (size?: number | undefined) => string;
};
export { slug, cuid };
