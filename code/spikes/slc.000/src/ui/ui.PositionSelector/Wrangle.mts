import { type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  pos(input: t.PositionInput | undefined, defaultPos: t.Pos = ['left', 'top']): t.Pos {
    if (Array.isArray(input)) return input;
    if (typeof input === 'object') return [input.x, input.y];
    return defaultPos;
  },

  position(x: number, y: number) {
    const horizontal: t.PositionX = x === 0 ? 'left' : x === 1 ? 'center' : 'right';
    const vertical: t.PositionY = y === 0 ? 'top' : y === 1 ? 'center' : 'bottom';
    const position: t.Position = { x: horizontal, y: vertical };
    const pos = [horizontal, vertical] as t.Pos;
    return { x, y, position, pos };
  },

  eqPos(a: t.Pos, b: t.Pos) {
    return a[0] === b[0] && a[1] === b[1];
  },
};
