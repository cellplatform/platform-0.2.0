import React from 'react';

import { t } from './common';

export function format(item: t.PropListItem) {
  const { label, tooltip, visible } = item;
  let _value: t.PropListValue | undefined;

  const res = {
    label,
    tooltip,
    visible,

    get value(): t.PropListValue {
      if (_value === undefined) {
        if (typeof item.value !== 'object') return { data: item.value };
        if (React.isValidElement(item.value)) return { data: item.value };
        _value = item.value as t.PropListValue;
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
      return React.isValidElement(res.value.data);
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

      if (typeof data === 'object' && !React.isValidElement(data)) {
        return JSON.stringify(data, null, '  ');
      }

      return data.toString();
    },

    isCopyable(defaults?: t.PropListDefaults) {
      if (res.value.clipboard || defaults?.clipboard) return true;
      return false;
    },
  };

  return res;
}
