import { Chip, DEFAULTS, FC, THEMES, type t } from './common';
import { Wrangle } from './u';

import { FieldSelector } from '../PropList.FieldSelector';
import { InfoPanel as Info } from '../PropList.InfoPanel';
import { FieldBuilder } from './FieldBuilder';
import { Hash } from './item';
import { View } from './ui';

type Fields = {
  THEMES: typeof THEMES;
  DEFAULTS: typeof DEFAULTS;
  Wrangle: {
    title: typeof Wrangle.title;
    fields: typeof Wrangle.fields;
    toggleField: typeof Wrangle.toggleField;
  };
  builder<F extends string>(): t.PropListFieldBuilder<F>;
  FieldBuilder: typeof FieldBuilder;
  FieldSelector: typeof FieldSelector;
  Info: typeof Info;
  Hash: typeof Hash;
  Chip: typeof Chip;
};

export const PropList = FC.decorate<t.PropListProps, Fields>(
  View,
  {
    THEMES,
    DEFAULTS,
    builder: FieldBuilder,
    FieldBuilder,
    FieldSelector,
    Info,
    Hash,
    Chip,
    Wrangle: {
      title: Wrangle.title,
      fields: Wrangle.fields,
      toggleField: Wrangle.toggleField,
    },
  },
  { displayName: 'PropList' },
);
