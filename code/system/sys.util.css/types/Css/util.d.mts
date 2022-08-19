import { t } from '../common.mjs';
/**
 * Takes an array of input CSS values and converts them to
 * [top, right, bottom, left] values.
 *
 * Input:
 *  - single value (eg. 0 or '5em')
 *  - 4-part array (eg. [10, null, 0, 5])
 *  - Y/X array    (eg. [20, 5])
 *
 */
export declare const toEdges: t.CssToEdges<t.CssEdges>;
/**
 * Prefixes each of the edge properties with the given prefix.
 */
export declare function prefixEdges<T extends Record<string, unknown>>(prefix: string, edges: Partial<t.CssEdges>): T;
/**
 * Converts input to CSS margin edges.
 */
export declare const toMargins: t.CssToEdges<t.CssMarginEdges>;
/**
 * Converts input to CSS padding edges.
 */
export declare const toPadding: t.CssToEdges<t.CssPaddingEdges>;
/**
 * Converts into to a box-shadow.
 */
export declare const toShadow: t.CssToShadow;
/**
 * Convert to position (eg "absolute") with a set of edges ("top", "right" etc).
 */
export declare const toPosition: t.CssToPosition;
export declare const toAbsolute: t.CssToAbsolute;
/**
 * Corner/border radius.
 */
export declare const toRadius: t.CssToRadius;
