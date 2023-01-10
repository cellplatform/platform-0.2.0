import { Value, t, Is } from '../common';
import { Color } from '../style.Color';

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
export const toEdges: t.CssToEdges<t.CssEdges> = (input, options = {}) => {
  if ((Array.isArray(input) && input.length === 0) || Is.blank(input)) {
    const { defaultValue } = options;
    if (defaultValue && !Is.blank(defaultValue)) {
      input = defaultValue;
    } else {
      return {};
    }
  }

  input = input || 0;

  if (!Array.isArray(input)) {
    input = input.toString().split(' ') as [t.CssEdgeInput];
  }

  const edges = input
    .map((item) =>
      typeof item === 'string' && item.endsWith('px') ? item.replace(/px$/, '') : item,
    )
    .map((item) => Value.toNumber(item));
  let top: number | undefined;
  let right: number | undefined;
  let bottom: number | undefined;
  let left: number | undefined;

  const getEdge = (index: number): number | undefined => {
    const edge = edges[index];
    if (edge === null || edge === 'null' || edge === '') return undefined;
    return edge;
  };

  switch (edges.length) {
    case 1:
      top = getEdge(0);
      bottom = getEdge(0);
      left = getEdge(0);
      right = getEdge(0);
      break;

    case 2:
      top = getEdge(0);
      bottom = getEdge(0);
      left = getEdge(1);
      right = getEdge(1);
      break;

    case 3:
      top = getEdge(0);
      left = getEdge(1);
      right = getEdge(1);
      bottom = getEdge(2);
      break;

    default:
      top = getEdge(0);
      right = getEdge(1);
      bottom = getEdge(2);
      left = getEdge(3);
  }

  if (top === undefined && right === undefined && bottom === undefined && left === undefined) {
    return {};
  } else {
    return { top, right, bottom, left };
  }
};

/**
 * Prefixes each of the edge properties with the given prefix.
 */
export function prefixEdges<T extends Record<string, unknown>>(
  prefix: string,
  edges: Partial<t.CssEdges>,
): T {
  return Object.keys(edges).reduce((acc, key) => {
    const value = edges[key as keyof t.CssEdges];
    key = `${prefix}${key[0].toUpperCase()}${key.substring(1)}`;
    return { ...acc, [key]: value };
  }, {}) as T;
}

/**
 * Converts input to CSS margin edges.
 */
export const toMargins: t.CssToEdges<t.CssMarginEdges> = (input, options = {}) => {
  return prefixEdges<t.CssMarginEdges>('margin', toEdges(input, options));
};

/**
 * Converts input to CSS padding edges.
 */
export const toPadding: t.CssToEdges<t.CssPaddingEdges> = (input, options = {}) => {
  return prefixEdges<t.CssPaddingEdges>('padding', toEdges(input, options));
};

/**
 * Converts into to a box-shadow.
 */
export const toShadow: t.CssToShadow = (input) => {
  if (input === undefined) return undefined;
  const { blur } = input;
  const x = input.x ? `${input.x}px` : '0';
  const y = input.y ? `${input.y}px` : '0';
  const col = Color.format(input.color);
  const inset = input.inner ? 'inset ' : '';
  return `${inset}${x} ${y} ${blur}px 0 ${col}`;
};

/**
 * Convert to position (eg "absolute") with a set of edges ("top", "right" etc).
 */
export const toPosition: t.CssToPosition = (position, edges) => {
  return { position, ...toEdges(edges) } as t.CssEdgePosition;
};
export const toAbsolute: t.CssToAbsolute = (edges) => toPosition('absolute', edges);

/**
 * Corner/border radius.
 */

export const toRadius: t.CssToRadius = (edges) => {
  if (edges === null || edges === undefined) return undefined;
  if (typeof edges === 'number') return `${edges}px`;
  if (typeof edges === 'string') return edges;
  if (Array.isArray(edges)) {
    const convert = (input: t.CssRadiusInput) => {
      if (typeof input === 'number') return input === 0 ? 0 : `${input}px`;
      if (input === null || input === undefined) return 0;
      return input || 0;
    };
    return [...edges.slice(0, 4), 0, 0, 0, 0].slice(0, 4).map(convert).join(' ');
  }
  return undefined;
};
