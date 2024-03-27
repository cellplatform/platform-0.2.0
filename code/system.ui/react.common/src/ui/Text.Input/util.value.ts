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
};
