import { Spec, t } from '../common';
import { Hr } from './ui.Hr';

/**
 * A horizontal-rule (visual divider).
 */
export function hr(input: t.DevCtxInput) {
  return Spec.once(input, (ctx) => {
    ctx.debug.row(<Hr />);
  });
}
