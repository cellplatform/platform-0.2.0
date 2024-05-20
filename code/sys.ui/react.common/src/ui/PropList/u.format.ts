import { isValidElement } from 'react';
import { type t } from './common';

export function format(item: t.PropListItem) {
  const { tooltip, visible } = item;
  let _label: t.PropListLabel | undefined;
  let _value: t.PropListValue | undefined;

  const res = {
    tooltip,
    visible,

    get label(): t.PropListLabel {
      if (_label === undefined) {
        if (typeof item.label !== 'object') _label = { body: item.label };
        else if (isValidElement(item.label)) _label = { body: item.label };
        else _label = item.label as t.PropListLabel;
      }
      return _label;
    },

    get value(): t.PropListValue {
      if (_value === undefined) {
        if (typeof item.value !== 'object') _value = { data: item.value };
        else if (isValidElement(item.value)) _value = { data: item.value };
        else _value = item.value as t.PropListValue;
      }
      return _value;
    },

    get isString() {
      return typeof res.value.data === 'string';
    },

    get isNumber() {
      return typeof res.value.data === 'number';
    },

    get isBoolean() {
      return typeof res.value.data === 'boolean';
    },

    get isComponent() {
      return isValidElement(res.value.data);
    },

    get isSimple() {
      return res.isString || res.isNumber || res.isBoolean;
    },

    get clipboard() {
      const value = res.value;
      const data = value.data;
      if (value.clipboard) {
        return typeof value.clipboard === 'boolean' ? data?.toString() || '' : value.clipboard;
      }

      if (data === null) return 'null';
      if (data === undefined) return 'undefined';

      if (typeof data === 'object' && !isValidElement(data)) {
        return JSON.stringify(data, null, '  ');
      }

      return data.toString();
    },

    isCopyable(defaults?: t.PropListDefaults) {
      if (res.value.clipboard || defaults?.clipboard) return true;
      return false;
    },
  } as const;

  return res;
}
