import { DEFAULTS, FC, t, THEMES } from './common';
import { FieldBuilder } from './FieldBuilder.mjs';
import { PropList as View } from './ui.PropList';
import { PropListProps } from './types.mjs';
import { FieldSelector } from './ui.FieldSelector';
import { Wrangle } from './Util.mjs';

export type { PropListProps };

type Fields = {
  THEMES: typeof THEMES;
  DEFAULTS: typeof DEFAULTS;
  Wrangle: { title: typeof Wrangle.title };
  FieldSelector: typeof FieldSelector;
  FieldBuilder: typeof FieldBuilder;
  builder<F extends string>(): t.PropListFieldBuilder<F>;
};

export const PropList = FC.decorate<PropListProps, Fields>(
  View,
  {
    THEMES,
    DEFAULTS,
    Wrangle: { title: Wrangle.title },
    FieldSelector,
    FieldBuilder,
    builder: FieldBuilder,
  },
  { displayName: 'PropList' },
);
