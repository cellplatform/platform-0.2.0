import { t } from '../common/index.mjs';
declare type O = t.IFsResolveOptionsLocal;
/**
 * Generates a resolver function.
 *
 * NOTE:
 *    Implemented here in general [cell.fs] because the local resolver
 *    is used in multiple "local" implementations (node-js, IndexedDb).
 */
export declare function FsDriverLocalResolver(args: {
    dir: string;
}): t.FsPathResolver<O>;
export {};
