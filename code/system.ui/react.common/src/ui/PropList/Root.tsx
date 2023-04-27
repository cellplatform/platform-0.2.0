import { DEFAULTS, FC, t, THEMES } from './common';
import { FieldBuilder } from './FieldBuilder.mjs';
import { PropList as View } from './ui/PropList';
import { PropListProps } from './types.mjs';
import { FieldSelector } from './ui.FieldSelector';
import { HashValue } from './ui.Item/Value.Hash';
import { Wrangle } from './Util.mjs';

export type { PropListProps };

type Fields = {
  THEMES: typeof THEMES;
  DEFAULTS: typeof DEFAULTS;
  Wrangle: { title: typeof Wrangle.title };
  builder<F extends string>(): t.PropListFieldBuilder<F>;
  FieldBuilder: typeof FieldBuilder;
  FieldSelector: typeof FieldSelector;
  HashValue: typeof HashValue;
};

export const PropList = FC.decorate<PropListProps, Fields>(
  View,
  {
    THEMES,
    DEFAULTS,
    Wrangle: { title: Wrangle.title },
    builder: FieldBuilder,
    FieldBuilder,
    FieldSelector,
    HashValue,
  },
  { displayName: 'PropList' },
);
