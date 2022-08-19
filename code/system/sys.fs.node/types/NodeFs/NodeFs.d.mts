import { t } from '../common/index.mjs';
/**
 * An interface for interacting with POSIX style file-systems
 * via the node-js API bindings.
 *
 * Union of:
 *
 *  - [node/module]: "fs-extra"
 *        author: nodejs
 *        The broadly used "sanity helpers" drop-in replacement for the node "fs".
 *        https://www.npmjs.com/package/fs-extra
 *
 *  - [node/module]: "path"
 *        author: nodejs
 *        https://nodejs.org/api/path.html
 *
 *  - [node/module]: "glob"
 *        author: @isaacs (NPM founder)
 *        https://www.npmjs.com/package/glob
 *
 */
export declare const NodeFs: t.NodeFs;
export declare const fs: t.NodeFs;
export default NodeFs;
