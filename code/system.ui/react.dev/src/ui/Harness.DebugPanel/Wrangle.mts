import { t, Color } from '../common';

export const Wrangle = {
  borderStyle(value?: t.DevRenderPropsDebugBorder) {
    if (!value?.color) return undefined;
    return `solid 1px ${Color.format(value.color)}`;
  },
};
