import { type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  pos(input: t.EdgePositionInput | undefined, defaultPos: t.EdgePos = ['left', 'top']): t.EdgePos {
    if (Array.isArray(input)) return input;
    if (typeof input === 'object') return [input.x, input.y];
    return defaultPos;
  },

  position(x: number, y: number) {
    const horizontal: t.EdgePositionX = x === 0 ? 'left' : x === 1 ? 'center' : 'right';
    const vertical: t.EdgePositionY = y === 0 ? 'top' : y === 1 ? 'center' : 'bottom';
    const position: t.EdgePosition = { x: horizontal, y: vertical };
    const pos = [horizontal, vertical] as t.EdgePos;
    return { x, y, position, pos };
  },

  eqPos(a: t.EdgePos, b: t.EdgePos) {
    return a[0] === b[0] && a[1] === b[1];
  },
};
