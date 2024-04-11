import { type t } from './common';
import { fields } from '../PropList/u.fields';

type ClickArgs<F extends string = string> = t.PropListFieldSelectorClickHandlerArgs<F>;

export const Wrangle = {
  fields,

  isSubfield(all: string[], field: string) {
    if (!field.includes('.')) return false;
    const prefix = field.substring(0, field.lastIndexOf('.'));
    return all.includes(prefix);
  },

  next(all: string[], selected: string[], field: string, modifiers: t.KeyboardModifierFlags) {
    type A = t.PropListFieldSelectorAction;
    const action: A = selected.includes(field) ? 'Deselect' : 'Select';
    let next = action === 'Select' ? [...selected, field] : selected.filter((f) => f !== field);
    if (modifiers.meta) {
      if (action === 'Select') next = Wrangle.addSubfields(all, next, field);
      if (action === 'Deselect') next = Wrangle.removeSubfields(all, next, field);
    }
    return { action, next } as const;
  },

  subfields(all: string[], field: string) {
    const match = `${field}.`;
    return all.filter((field) => field.startsWith(match));
  },

  addSubfields(all: string[], selected: string[], field: string) {
    const subfields = Wrangle.subfields(all, field);
    selected = selected.filter((f) => !subfields.includes(f));
    const index = selected.indexOf(field);
    selected.splice(index < 0 ? selected.length : index + 1, 0, ...subfields);
    return selected;
  },

  removeSubfields(all: string[], selected: string[], field: string) {
    const subfields = Wrangle.subfields(all, field);
    return selected.filter((f) => !subfields.includes(f));
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
