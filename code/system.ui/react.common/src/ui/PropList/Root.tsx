import { Wrangle } from './Util.mjs';
import { Chip, DEFAULTS, FC, THEMES, type t } from './common';

import { FieldSelector } from '../PropList.FieldSelector';
import { FieldBuilder } from './FieldBuilder.mjs';
import { Hash } from './ui.Item/Value.Hash';
import { PropList as View } from './ui/PropList';

type Fields = {
  THEMES: typeof THEMES;
  DEFAULTS: typeof DEFAULTS;
  Wrangle: { title: typeof Wrangle.title };
  builder<F extends string>(): t.PropListFieldBuilder<F>;
  FieldBuilder: typeof FieldBuilder;
  FieldSelector: typeof FieldSelector;
  Hash: typeof Hash;
  Chip: typeof Chip;
};

export const PropList = FC.decorate<t.PropListProps, Fields>(
  View,
  {
    THEMES,
    DEFAULTS,
    Wrangle: { title: Wrangle.title },
    builder: FieldBuilder,
    FieldBuilder,
    FieldSelector,
    Hash,
    Chip,
  },
  { displayName: 'PropList' },
);
