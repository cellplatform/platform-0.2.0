import { t } from './common';
import { format } from './Util.format.mjs';
import { theme } from './Util.theme.mjs';

export const Util = {
  format,
  theme,

  asItems(input: t.PropListProps['items']) {
    if (Array.isArray(input)) {
      return input;
    }

    if (typeof input === 'object') {
      return Object.keys(input).map((key) => {
        const item: t.PropListItem = { label: key, value: Util.toRenderValue(input[key]) };
        return item;
      });
    }

    return [];
  },

  toRenderValue(input: any) {
    if (input === null) return null;
    if (input === undefined) return undefined;

    /**
     * TODO 🐷
     * Expand this out to be more nuanced in display value types
     * eg, color-coding, spans etc:
     *  - {object}
     *  - [Array]
     */

    if (Array.isArray(input)) {
      return `[Array](${input.length})`;
    }

    if (typeof input === 'object') {
      return `{object}`;
    }

    return input.toString();
  },
};
