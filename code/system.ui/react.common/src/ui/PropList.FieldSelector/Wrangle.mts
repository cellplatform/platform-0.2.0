import { type t } from './common';

type ClickArgs<F extends string = string> = t.PropListFieldSelectorClickHandlerArgs<F>;

export const Wrangle = {
  isSubfield(all: string[], field: string) {
    if (!field.includes('.')) return false;
    const prefix = field.substring(0, field.lastIndexOf('.'));
    return all.includes(prefix);
  },

  subfields(all: string[], field: string) {
    const match = `${field}.`;
    return all.filter((field) => field.startsWith(match));
  },

  next(autoSubfield: boolean, all: string[], selected: string[], field: string) {
    type A = t.PropListFieldSelectorAction;
    const action: A = selected.includes(field) ? 'Deselect' : 'Select';
    let next = action === 'Select' ? [...selected, field] : selected.filter((f) => f !== field);
    return {
      action,
      next: autoSubfield ? Wrangle.adjustSubfields(all, next) : next,
    } as const;
  },

  adjustSubfields(all: string[], selected: string[]) {
    /**
     * TODO 🐷
     * - If a parent is selected, select all children.
     * - If a parent is NOT selected, deselect all children.
     */
    return selected;
  },

  clickArgs(input: Omit<ClickArgs, 'as'>): ClickArgs {
    const payload: ClickArgs = {
      ...input,
      as<T extends string>() {
        return payload as ClickArgs<T>;
      },
    };
    return payload;
  },
} as const;
