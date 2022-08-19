import { transform } from './Css/css.mjs';
export declare class CssValue {
}
export declare type Falsy = undefined | null | false;
export declare type CssProps = React.CSSProperties;
export declare type CssPropsMap = {
    [selector: string]: CssPropsMapObject;
};
export declare type CssPropsMapObject = CssProps & {
    ':first-child'?: CssProps;
    ':last-child'?: CssProps;
    ':focus'?: CssProps;
    ':hover'?: CssProps;
    ':visited'?: CssProps;
};
export declare type CssClassName = (...styles: Array<CssProps | undefined>) => string;
export declare type CssMergeRules = (...rules: any[]) => CssProps;
export declare type CssTransform = (style?: CssProps | CssValue | Falsy) => CssProps | CssValue;
/**
 * API
 */
export declare type CssFormat = (...styles: Array<CssProps | CssValue | Falsy>) => CssValue;
export declare type CssStyle = {
    transform: typeof transform;
    format: CssFormat;
    global: CssGlobal;
    head: CssHead;
    image: CssFormatImage;
    toEdges: CssToEdges<CssEdges>;
    toMargins: CssToEdges<CssMarginEdges>;
    toPadding: CssToEdges<CssPaddingEdges>;
    toShadow: CssToShadow;
    toPosition: CssToPosition;
    toAbsolute: CssToAbsolute;
    toRadius: CssToRadius;
    reset(): void;
};
/**
 * Global
 */
export declare type CssGlobal = (styles: CssPropsMap, options?: {
    prefix?: string;
}) => void;
export declare type CssHead = {
    importStylesheet(url: string): CssHead;
};
/**
 * Edges
 */
declare type N = string | number | null | undefined;
export declare type CssEdgeInput = N;
export declare type CssEdgesInput = N | [N] | [N, N] | [N, N, N, N];
export declare type CssToEdges<T> = (input?: CssEdgesInput | [], options?: {
    defaultValue?: CssEdgesInput;
}) => Partial<T>;
export declare type CssEdges = {
    top: string | number;
    right: string | number;
    bottom: string | number;
    left: string | number;
};
export declare type CssMarginEdges = {
    marginTop: string | number;
    marginRight: string | number;
    marginBottom: string | number;
    marginLeft: string | number;
};
export declare type CssPaddingEdges = {
    paddingTop: string | number;
    paddingRight: string | number;
    paddingBottom: string | number;
    paddingLeft: string | number;
};
/**
 * Image
 */
export declare type CssFormatImageOptions = {
    width?: number;
    height?: number;
};
export declare type CssFormatImage = (image1x: string | undefined, image2x: string | undefined, options?: CssFormatImageOptions) => CssBackgroundImage;
export declare type CssBackgroundImage = {
    backgroundImage: string;
    width?: number;
    height?: number;
    backgroundSize: string;
    backgroundRepeat: string;
};
/**
 * Shadow
 */
export declare type CssToShadow = (input?: CssShadow) => string | undefined;
export declare type CssShadow = {
    color: number | string;
    blur: number;
    x?: number;
    y?: number;
    inner?: boolean;
};
/**
 * Position
 */
export declare type CssPosition = 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky';
export declare type CssEdgePosition = CssEdges & {
    position: CssPosition;
};
export declare type CssToPosition = (position: CssPosition, edges: CssEdgesInput) => CssEdgePosition;
export declare type CssToAbsolute = (edges: CssEdgesInput) => CssEdgePosition;
/**
 * Border/Corner Radius
 */
export declare type CssRadiusInput = N | [N, N, N, N];
export declare type CssToRadius = (corner: CssRadiusInput) => string | undefined;
export {};
