import { t, Color } from '../common';

export const Wrangle = {
  borderStyle(props?: t.DevRenderPropsDebugBar) {
    const color = props?.border?.color;
    return color === undefined ? undefined : `solid 1px ${Color.format(color)}`;
  },
};
