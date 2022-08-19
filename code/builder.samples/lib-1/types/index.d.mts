import { Foo } from './foo';
export declare const Name = "lib-1";
export declare const Bar: {
    count: number;
    msg: string;
};
export { Foo };
export declare const Imports: {
    bar: Promise<typeof import("./child/bar.mjs")>;
    two: Promise<typeof import("./two")>;
};
export * from './types';
import * as t from './types';
export { t };
/**
 * Workers
 * https://vitejs.dev/guide/features.html#web-workers
 */
