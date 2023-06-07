import { type t } from '../../common';

export const Util = {
  getFlexAlignment(align?: t.DocImageAlign) {
    if (align === 'Center') return 'x-center-center';
    if (align === 'Right') return 'x-center-end';
    return;
  },

  getOffsetTransform(offset?: { x?: number; y?: number }) {
    if (!offset) return;
    let _css = '';
    if (offset.x) _css += ` translateX(${offset.x}px)`;
    if (offset.y) _css += ` translateY(${offset.y}px)`;
    return _css.trim();
  },
};
