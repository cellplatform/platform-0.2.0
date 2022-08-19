import { t } from '../common.mjs';
export * from './util.mjs';
export declare const MEDIA_QUERY_RETINA = "@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)";
/**
 * Constructs a style object for an image.
 *
 *    For turning image files (PNG/JPG/SVG) into data-uri's see:
 *    https://github.com/webpack/url-loader
 *
 * @param {string} image1x: The normal image resolution (base64 encoded)
 * @param {string} image2x: The retina image resolution (base64 encoded)
 * @param {integer} width: Optional. The width of the image.
 * @param {integer} height: Optional. The height of the image.
 */
export declare const image: (image1x: string | undefined, image2x: string | undefined, options?: t.CssFormatImageOptions) => t.CssBackgroundImage;
export declare const toPositionEdges: (key: string, value?: any) => t.CssEdgePosition | undefined;
export declare const formatPositionEdges: (key: string, target: any) => void;
export declare const transform: t.CssTransform;
export declare const format: t.CssFormat;
