import tinycolor from 'tinycolor2';
export declare const RED = "rgba(255, 0, 0, 0.1)";
/**
 * Creates a new tiny-color instance.
 * https://github.com/bgrins/TinyColor
 */
export declare function create(value: any): tinycolor.Instance;
export declare const black: () => tinycolor.Instance;
export declare const white: () => tinycolor.Instance;
/**
 * Mixes two colors.
 * https://github.com/bgrins/TinyColor#color-utilities
 */
export declare function mix(color1: tinycolor.ColorInput, color2: tinycolor.ColorInput, amount?: number): tinycolor.Instance;
/**
 * Takes a value of various types and converts it into a color.
 */
export declare function format(value: string | number | boolean | undefined): string | undefined;
/**
 * A number between -1 (black) and 1 (white).
 */
export declare function toGrayAlpha(value: number): string;
/**
 * A number between -1 (black) and 1 (white).
 */
export declare function toGrayHex(value: number): string;
/**
 * Converts a color to an alpha RGB value.
 */
export declare function alpha(color: string, alpha: number): string;
/**
 * Lightens the given color.
 * @param amount: 0..100
 */
export declare function lighten(color: string, amount: number): string;
/**
 * Darkens the given color.
 * @param amount: 0..100
 */
export declare function darken(color: string, amount: number): string;
