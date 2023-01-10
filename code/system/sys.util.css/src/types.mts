export class CssValue {}
export type Falsy = undefined | null | false;
export type CssProps = React.CSSProperties;

export type CssPropsMap = { [selector: string]: CssPropsMapObject };
export type CssPropsMapObject = CssProps & {
  ':first-child'?: CssProps;
  ':last-child'?: CssProps;
  ':focus'?: CssProps;
  ':hover'?: CssProps;
  ':visited'?: CssProps;
};

export type CssClassName = (...styles: Array<CssProps | undefined>) => string;
export type CssMergeRules = (...rules: any[]) => CssProps;
export type CssTransform = (style?: CssProps | CssValue | Falsy) => CssProps | CssValue;

/**
 * API
 */
export type CssFormat = (...styles: Array<CssProps | CssValue | Falsy>) => CssValue;

export type CssStyle = {
  transform: CssTransform;
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
export type CssGlobal = (styles: CssPropsMap, options?: { prefix?: string }) => void;
export type CssHead = {
  importStylesheet(url: string): CssHead;
};

/**
 * Edges
 */
type N = string | number | null | undefined;

export type CssEdgeInput = N;
export type CssEdgesInput = N | [N] | [N, N] | [N, N, N, N];
export type CssToEdges<T> = (
  input?: CssEdgesInput | [],
  options?: { defaultValue?: CssEdgesInput },
) => Partial<T>;
export type CssEdges = {
  top: string | number;
  right: string | number;
  bottom: string | number;
  left: string | number;
};
export type CssMarginEdges = {
  marginTop: string | number;
  marginRight: string | number;
  marginBottom: string | number;
  marginLeft: string | number;
};
export type CssPaddingEdges = {
  paddingTop: string | number;
  paddingRight: string | number;
  paddingBottom: string | number;
  paddingLeft: string | number;
};

/**
 * Image
 */
export type CssFormatImageOptions = { width?: number; height?: number };
export type CssFormatImage = (
  image1x: string | undefined,
  image2x: string | undefined,
  options?: CssFormatImageOptions,
) => CssBackgroundImage;

export type CssBackgroundImage = {
  backgroundImage: string;
  width?: number;
  height?: number;
  backgroundSize: string;
  backgroundRepeat: string;
};

/**
 * Shadow
 */
export type CssToShadow = (input?: CssShadow) => string | undefined;
export type CssShadow = {
  color: number | string;
  blur: number;
  x?: number;
  y?: number;
  inner?: boolean;
};

/**
 * Position
 */
export type CssPosition = 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky';
export type CssEdgePosition = CssEdges & { position: CssPosition };

export type CssToPosition = (position: CssPosition, edges: CssEdgesInput) => CssEdgePosition;
export type CssToAbsolute = (edges: CssEdgesInput) => CssEdgePosition;

/**
 * Border/Corner Radius
 */
export type CssRadiusInput = N | [N, N, N, N];
export type CssToRadius = (corner: CssRadiusInput) => string | undefined;
