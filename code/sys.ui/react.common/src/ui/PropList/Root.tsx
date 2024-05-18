import { Chip, DEFAULTS, FC, type t } from './common';
import { Wrangle } from './u';

import { FieldSelector } from '../PropList.FieldSelector';
import { CommonInfo } from '../PropList.InfoPanel';
import { FieldBuilder } from './FieldBuilder';
import { Hash } from './item';
import { View } from './ui';
import { Empty } from './ui.Empty';

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Wrangle: {
    title: typeof Wrangle.title;
    fields: typeof Wrangle.fields;
    toggleField: typeof Wrangle.toggleField;
  };
  fields: typeof Wrangle.fields;
  builder<F extends string>(): t.PropListFieldBuilder<F>;
  FieldBuilder: typeof FieldBuilder;
  FieldSelector: typeof FieldSelector;
  Info: typeof CommonInfo;
  Hash: typeof Hash;
  Chip: typeof Chip;
  Empty: typeof Empty;
};

export const PropList = FC.decorate<t.PropListProps, Fields>(
  View,
  {
    DEFAULTS,
    Wrangle: {
      title: Wrangle.title,
      fields: Wrangle.fields,
      toggleField: Wrangle.toggleField,
    },
    fields: Wrangle.fields,
    builder: FieldBuilder,
    FieldBuilder,
    FieldSelector,
    Info: CommonInfo,
    Hash,
    Chip,
    Empty,
  },
  { displayName: 'PropList' },
);
