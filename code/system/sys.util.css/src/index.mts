import { t } from './common.t';

export * from './types.mjs';
export { reset } from './style.reset';

/**
 * Color helpers.
 */
import { Color } from './style.Color';
export { Color };
export const formatColor = Color.format;

/**
 * Primary {style} API.
 */
import * as api from './Style.mjs';
export const Style = api as any as t.CssStyle;
export const Css = Style.format;
export const css = Css;
