import { Is, t } from '../common';

export const Masks = {
  /**
   * Ensure entered text is only a number.
   */
  isNumeric(e: t.TextInputMask) {
    return Is.numeric(e.char);
  },
};
