import { t, DEFAULTS } from './common';
import { format } from './Util.format.mjs';
import { theme } from './Util.theme.mjs';

export const Wrangle = {
  format,
  theme,

  sizeProp(input?: t.PropListSize | number) {
    return typeof input === 'number' ? { fixed: input } : input;
  },

  cardProps(input: t.PropListProps): t.PropListCard | undefined {
    if (!input.card) return undefined;
    if (typeof input.card === 'object') return input.card;
    return DEFAULTS.card;
  },

  items(input: t.PropListProps['items']) {
    if (Array.isArray(input)) {
      return input;
    }

    if (typeof input === 'object') {
      return Object.keys(input).map((key) => {
        const item: t.PropListItem = { label: key, value: Wrangle.renderValue(input[key]) };
        return item;
      });
    }

    return [];
  },

  renderValue(input: any) {
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

  title(input?: t.PropListTitleInput): t.PropListTitle {
    if (!input) return { value: [null, null] };

    if (typeof input === 'object' && !Array.isArray(input)) {
      const obj = input as t.PropListTitle;
      const value = Wrangle.titleValue(obj.value);
      return { ...obj, value };
    }

    const value = Wrangle.titleValue(input);
    return { value };
  },

  titleValue(input: t.PropListTitle['value']): [t.PropListTitleContent, t.PropListTitleContent] {
    if (!input) return [null, null];

    const list = Array.isArray(input) ? input : [input];
    const left = list[0] ?? null;
    const right = list[1] ?? null;
    return [left, right] as [t.PropListTitleContent, t.PropListTitleContent];
  },
};
