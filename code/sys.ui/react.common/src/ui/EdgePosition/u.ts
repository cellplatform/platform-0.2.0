import { DEFAULTS, type t } from './common';
import { Wrangle as SelectorWrangle } from '../EdgePosition.Selector/u';

const { toPos, toPosition } = SelectorWrangle;

/**
 * Helpers
 */
export const Wrangle = {
  toPosition,
  toPos,

  gridCss(input?: t.EdgePositionInput): t.CSSProperties {
    const pos = Wrangle.toPos(input, DEFAULTS.position);
    return {
      display: 'grid',
      justifyContent: Wrangle.justifyContent(pos[0]),
      alignContent: Wrangle.alignContent(pos[1]),
    } as const;
  },

  justifyContent(x: t.EdgePositionX) {
    if (x === 'left') return 'start';
    if (x === 'center') return 'center';
    if (x === 'right') return 'end';
    return 'start';
  },

  alignContent(x: t.EdgePositionY) {
    if (x === 'top') return 'start';
    if (x === 'center') return 'center';
    if (x === 'bottom') return 'end';
    return 'start';
  },
} as const;
