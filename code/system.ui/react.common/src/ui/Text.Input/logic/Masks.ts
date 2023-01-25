import { Value, t, Is } from '../common';

export const TextInputMasks = {
  /**
   * Ensure entered text is only a number.
   */
  isNumeric(e: t.TextInputMask) {
    return Is.numeric(e.char);
  },
};
