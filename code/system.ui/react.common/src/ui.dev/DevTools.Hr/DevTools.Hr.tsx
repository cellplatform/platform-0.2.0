import { Spec, t } from '../common';
import { Hr } from './ui.Hr';

/**
 * A horizontal-rule (visual divider).
 */
export function hr(input: t.DevCtxInput) {
  const ctx = Spec.ctx(input);
  if (!ctx.is.initial) return;

  ctx.debug.row(<Hr />);
}
