import * as t from './types.mjs';
export { reset } from './reset/index.mjs';

export type CssProps = t.CssProps;
export type CssValue = t.CssValue;

/**
 * Color helpers.
 */
import { Color } from './Color/index.mjs';
export { Color };
export const formatColor = Color.format;

/**
 * Primary {style} API.
 */
import * as api from './Style.mjs';
export const Style = api as any as t.CssStyle;
export const Css = Style.format;
export const css = Css;
