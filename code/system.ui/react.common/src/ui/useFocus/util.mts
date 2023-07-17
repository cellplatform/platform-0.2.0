import type { t } from '../../common.t';

/**
 * [Helpers]
 */
export const Wrangle = {
  args(focus: boolean): t.FocusHandlerArgs {
    const action = focus ? 'focus' : 'blur';
    const blur = !focus;
    return { action, focus, blur };
  },
};
