import * as t from './types.mjs';
export { reset } from './reset/index.mjs';
export declare type CssProps = t.CssProps;
export declare type CssValue = t.CssValue;
/**
 * Color helpers.
 */
import { Color } from './Color/index.mjs';
export { Color };
export declare const formatColor: typeof Color.format;
export declare const Style: t.CssStyle;
export declare const Css: t.CssFormat;
export declare const css: t.CssFormat;
