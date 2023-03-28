import { t } from './common';
import { diffChars } from 'diff';

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

  diff(from: string, to: string): t.TextInputCharDiff[] {
    const changes = diffChars(from, to, { ignoreCase: false });
    const res: t.TextInputCharDiff[] = [];

    let index = 0;
    changes.forEach((item) => {
      const value = item.value;
      const kind = item.added ? 'Added' : item.removed ? 'Deleted' : 'Unchanged';
      res.push({ kind, index, value });
      index += value.length;
    });

    return res;
  },
};
