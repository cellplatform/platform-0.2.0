import { DEFAULTS, type t } from './common';
import { Wrangle as WrangleSelector } from '../ui.PositionSelector/Wrangle.mjs';

const { pos } = WrangleSelector;

/**
 * Helpers
 */
export const Wrangle = {
  pos,

  gridCss(input?: t.PositionInput): t.CSSProperties {
    const pos = Wrangle.pos(input, DEFAULTS.pos);
    return {
      display: 'grid',
      justifyContent: Wrangle.justifyContent(pos[0]),
      alignContent: Wrangle.alignContent(pos[1]),
    } as const;
  },

  justifyContent(x: t.PositionX) {
    if (x === 'left') return 'start';
    if (x === 'center') return 'center';
    if (x === 'right') return 'end';
    return 'start';
  },

  alignContent(x: t.PositionY) {
    if (x === 'top') return 'start';
    if (x === 'center') return 'center';
    if (x === 'bottom') return 'end';
    return 'start';
  },
} as const;
