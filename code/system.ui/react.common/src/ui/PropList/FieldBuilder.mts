import { type t } from './common';

/**
 * Field builder.
 */
export function FieldBuilder<F extends string>(): t.PropListFieldBuilder<F> {
  type H = t.PropListItemFactory | t.PropListItem;
  const handlers: [F, H][] = [];
  const find = (name: F) => handlers.find((item) => item[0] === name)?.[1];

  const run = (name: F) => {
    const item = find(name);
    const res = typeof item === 'function' ? item() : item;
    return res ? res : undefined;
  };

  const api: t.PropListFieldBuilder<F> = {
    /**
     * Define a field factory.
     */
    field(name: F, item: H) {
      if (find(name)) throw new Error(`Handler named '${name}' already added.`);
      handlers.push([name, item]);
      return api;
    },

    /**
     * Convert fields to <PropList> items.
     */
    items(fields: F[] = []) {
      const list: t.PropListItem[] = [];

      fields.filter(Boolean).forEach((name) => {
        const res = run(name);
        if (!res) return;
        (Array.isArray(res) ? res : [res]).forEach((item) => list.push(item));
      });

      return list;
    },
  };

  return api;
}
