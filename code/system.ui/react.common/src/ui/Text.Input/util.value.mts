/**
 * Textbox value helpers.
 */
export const ValueUtil = {
  format(value?: string, maxLength?: number) {
    value = value || '';
    if (typeof maxLength === 'number' && value.length > maxLength) {
      value = value.substring(0, maxLength);
    }
    return value;
  },

  getChangedChar(from: string, to: string) {
    if (to.length === from.length) return '';
    if (to.length < from.length) return '';

    let index = 0;
    for (const toChar of to) {
      const fromChar = from[index];
      if (toChar !== fromChar) return toChar; // Exit - changed character found.
      index += 1;
    }

    return ''; // No change.
  },
};
