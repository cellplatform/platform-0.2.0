import { COLORS, Color, DEFAULTS, WrangleCard, type t } from './common';
import { format } from './u.format';
import { theme } from './u.theme';

export const Wrangle = {
  format,
  theme,

  fields<T extends string>(input: (T | undefined | null)[] | undefined, defaults?: T[]): T[] {
    return (input ?? defaults ?? []).filter(Boolean) as T[];
  },

  sizeProp(input?: t.PropListSize | number) {
    return typeof input === 'number' ? { fixed: input } : input;
  },

  selected(item: t.PropListItem, isDark: boolean): t.PropListItemSelected | undefined {
    const value = item.selected;
    if (!value) return undefined;
    if (typeof value === 'object') return value;
    if (isDark) return { color: 0.05 };
    if (!isDark) return { color: Color.alpha(COLORS.DARK, 0.03) };
    return;
  },

  cardProps(input: t.PropListProps): t.PropListCard | undefined {
    if (!input.card) return undefined;
    if (typeof input.card === 'object') return input.card;

    const { theme = DEFAULTS.theme } = input;
    const isDark = theme === 'Dark';

    const flipSpeed = 300;
    const shadow = true;
    const background = isDark ? WrangleCard.bg({ background: { color: 0.05 } }) : undefined;
    const border = isDark ? WrangleCard.border({ border: { color: 0.3 } }) : undefined;

    return { flipSpeed, shadow, background, border };
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

  hasTitle(input?: t.PropListTitleInput) {
    const title = Wrangle.title(input);
    if (!title.value) return false;
    if (Array.isArray(title.value) && title.value.filter(Boolean).length === 0) return false;
    return true;
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
