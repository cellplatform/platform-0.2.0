import { glamor, t, Is } from '../common';
import * as Util from './util.mjs';

export * from './util.mjs';
export const MEDIA_QUERY_RETINA = `@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)`;

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
export const image = (
  image1x: string | undefined,
  image2x: string | undefined,
  options: t.CssFormatImageOptions = { width: 10, height: 10 },
): t.CssBackgroundImage => {
  // Prepare image based on current screen density.
  if (!image1x) throw new Error('Must have at least a 1x image.');

  const { width, height } = options;
  const result: any = {
    width,
    height,
    backgroundImage: `url(${image1x})`,
    backgroundSize: `${width}px ${height}px`,
    backgroundRepeat: 'no-repeat',
  };

  if (image2x) {
    result[MEDIA_QUERY_RETINA] = {
      backgroundImage: `url(${image2x})`,
    };
  }

  // Finish up.
  return result;
};

const mergeAndReplace = (key: string, value: any, target: React.CSSProperties) => {
  Object.assign(target, value);
  delete target[key as keyof React.CSSProperties];
  return target;
};

const formatImage = (key: string, value: Array<string | number | undefined>, target: any) => {
  // Wrangle parameters.
  let [image1x, image2x, width, height] = value; // eslint-disable-line

  if (typeof image2x === 'number') {
    height = width;
    width = image2x;
    image2x = undefined;
  }
  const options = {
    width: width as number,
    height: height as number,
  };
  const style = image(image1x as string, image2x as string, options);
  mergeAndReplace(key, style, target);
};

export const toPositionEdges = (
  key: string,
  value: any = undefined,
): t.CssEdgePosition | undefined => {
  const position = key.toLowerCase() as t.CssPosition;
  const res = Util.toPosition(position, value);
  const edges: (keyof t.CssEdges)[] = ['top', 'right', 'bottom', 'left'];
  const isEmpty = edges.every((edge) => res[edge] === undefined);
  return isEmpty ? undefined : res;
};

export const formatPositionEdges = (key: string, target: any) => {
  const styles = toPositionEdges(key, target[key]);
  mergeAndReplace(key, styles, target);
};

/**
 * AbsoluteCenter
 *      - x
 *      - y
 *      - xy
 */
const formatAbsoluteCenter = (key: string, value: string | boolean | number, target: any) => {
  if (value === true) {
    value = 'xy';
  }
  if (value === false || value === undefined || value === null) {
    return;
  }
  const styles = {
    position: 'absolute',
    left: target.left,
    top: target.top,
    transform: '',
  };
  const stringValue = value.toString().trim().toLowerCase();
  if (stringValue.includes('x')) {
    styles.left = '50%';
  }
  if (stringValue.includes('y')) {
    styles.top = '50%';
  }
  let transform: string;
  switch (value) {
    case 'yx':
    case 'xy':
      transform = 'translate(-50%, -50%)';
      break;
    case 'x':
      transform = 'translateX(-50%)';
      break;
    case 'y':
      transform = 'translateY(-50%)';
      break;
    default:
      throw new Error(`AbsoluteCenter value '${value}' not supported.`);
  }
  styles.transform = `${target.transform || ''} ${transform}`.trim();
  mergeAndReplace(key, styles, target);
};

/**
 * Spacing on the X:Y plane.
 */
function formatSpacingPlane(
  plane: 'x' | 'y' | 'xy',
  prefix: 'margin' | 'padding',
  key: string,
  value: any,
  target: any,
) {
  const styles = {} as any;
  const edges = Util.toEdges(value);
  if (edges && plane.includes('x')) {
    styles[`${prefix}Left`] = edges.left;
    styles[`${prefix}Right`] = edges.right;
  }
  if (edges && plane.includes('y')) {
    styles[`${prefix}Top`] = edges.top;
    styles[`${prefix}Bottom`] = edges.bottom;
  }
  mergeAndReplace(key, styles, target);
}

/**
 * Sets up vertical scrolling including iOS momentum scrolling.
 * See:
 *    https://css-tricks.com/snippets/css/momentum-scrolling-on-ios-overflow-elements/
 */
function formatScroll(key: string, value: any, target: any) {
  if (value === true) {
    const styles = {
      overflowX: 'hidden',
      overflowY: 'scroll',
      WebkitOverflowScrolling: 'touch',
    };
    mergeAndReplace(key, styles, target);
  }

  if (value === false) {
    const styles = {
      overflow: 'hidden',
    };
    mergeAndReplace(key, styles, target);
  }
}

function formatSize(key: string, value: any, target: any) {
  if (typeof value === 'number' || typeof value === 'string') {
    const styles = { width: value, height: value };
    mergeAndReplace(key, styles, target);
  }
}

const AlignMap: { [k: string]: string } = {
  center: 'center',
  left: 'flex-start',
  top: 'flex-start',
  start: 'flex-start',
  right: 'flex-end',
  bottom: 'flex-end',
  end: 'flex-end',
  full: 'stretch',
  stretch: 'stretch',
  baseline: 'baseline',
};
function convertCrossAlignToFlex(token: string): string | undefined {
  return AlignMap[token] || undefined; // undefined if not recognised;
}

const MainAlignMap: { [k: string]: string } = {
  center: 'center',
  left: 'flex-start',
  top: 'flex-start',
  start: 'flex-start',
  right: 'flex-end',
  bottom: 'flex-end',
  end: 'flex-end',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  spaceEvenly: 'space-evenly',
};
function convertMainAlignToFlex(token: string): string | undefined {
  return MainAlignMap[token] || undefined; // undefined if not recognised;
}

/**
 * Format a flex css helper
 * Format: [<direction>]-<crossAlignment>-<mainAlignment>
 */
function formatFlexPosition(key: string, value: string, target: t.CssProps) {
  let direction: 'row' | 'column' | undefined; // Assume horizontal
  let mainAlignment: string | undefined;
  let crossAlignment: string | undefined;

  // Tokenize string
  const tokens: string[] = value.split('-').map((token) => token.trim());

  tokens.map((token) => {
    const tokenIsOneOf = (options: string[]) => options.includes(token);
    if (direction == null && tokenIsOneOf(['horizontal', 'vertical', 'x', 'y'])) {
      if (token === 'x') token = 'horizontal';
      if (token === 'y') token = 'vertical';
      direction = token === 'vertical' ? 'column' : 'row'; // eslint-disable-line
      return;
    }

    if (
      tokenIsOneOf(['center', 'start', 'end', 'left', 'right', 'top', 'bottom', 'full', 'baseline'])
    ) {
      if (crossAlignment === null) {
        if (direction === null && tokenIsOneOf(['left', 'right'])) direction = 'column';
        if (direction === null && tokenIsOneOf(['top', 'bottom'])) direction = 'row';
        crossAlignment = convertCrossAlignToFlex(token);
        return;
      }
      mainAlignment = convertMainAlignToFlex(token);
      return;
    }

    if (tokenIsOneOf(['spaceAround', 'spaceBetween', 'spaceEvenly'])) {
      mainAlignment = convertMainAlignToFlex(token);
      return;
    }
  });

  const styles = {
    display: 'flex',
    flexDirection: direction,
    alignItems: crossAlignment,
    justifyContent: mainAlignment,
  };

  mergeAndReplace(key, styles, target);
}

export const transform: t.CssTransform = (style) => {
  if (style === null || style === undefined || style === false) return {};
  if (typeof style !== 'object') return style;

  const obj = style as {
    [key: string]:
      | t.CssProps
      | t.CssValue
      | Array<string | number | undefined>
      | string
      | number
      | undefined;
  };

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (value === false || value === null || value === undefined) {
      delete obj[key];
    } else if (Is.plainObject(value)) {
      // NB: This is not using formatCss, as we only want the transform, we don't want to convert it to a glamor value.
      obj[key] = transform(value); // <== RECURSION.
    } else {
      switch (key) {
        case 'Image':
          formatImage(key, value as any, style);
          break;
        case 'Absolute':
          formatPositionEdges(key, style);
          break;
        case 'Fixed':
          formatPositionEdges(key, style);
          break;
        case 'AbsoluteCenter':
          formatAbsoluteCenter(key, value as any, style);
          break;
        case 'Margin':
          formatSpacingPlane('xy', 'margin', key, value, style);
          break;
        case 'MarginX':
          formatSpacingPlane('x', 'margin', key, value, style);
          break;
        case 'MarginY':
          formatSpacingPlane('y', 'margin', key, value, style);
          break;
        case 'Padding':
          formatSpacingPlane('xy', 'padding', key, value, style);
          break;
        case 'PaddingX':
          formatSpacingPlane('x', 'padding', key, value, style);
          break;
        case 'PaddingY':
          formatSpacingPlane('y', 'padding', key, value, style);
          break;
        case 'Flex':
          formatFlexPosition(key, value as string, style);
          break;
        case 'Scroll':
          formatScroll(key, value, style);
          break;
        case 'Size':
          formatSize(key, value, style);
          break;

        default:
        // Ignore.
      }
    }
  });

  return style;
};

/**
 * Helpers for constructing a CSS object.
 * NB: This doesn't *actually* return React.CSSProperties
 */
const isJss = (input: any) =>
  typeof input === 'object' && typeof input.hash === 'number' && Array.isArray(input.values);

const flattenJss = (input: S[]) => {
  const output: any[] = [];
  input.forEach((item) => {
    if (isJss(item)) {
      flattenJss((item as any).values).forEach((child) => output.push(child)); // <== RECURSION 🌳
    } else {
      output.push(transform(item));
    }
  });
  return output;
};

type S = t.CssProps | t.CssValue | t.Falsy;
const formatCss = (...styles: S[]): t.CssValue => glamor.css(...flattenJss(styles));

/**
 * Export.
 */
(formatCss as any).image = image;
export const format = formatCss as t.CssFormat;
