import { DEFAULTS, FC, t, THEMES } from './common';
import { FieldBuilder } from './FieldBuilder.mjs';
import { PropList as View } from './PropList.View';
import { PropListProps } from './types.mjs';
import { FieldSelector } from './ui.FieldSelector';

export type { PropListProps };

type Fields = {
  THEMES: typeof THEMES;
  DEFAULTS: typeof DEFAULTS;
  FieldSelector: typeof FieldSelector;
  FieldBuilder: typeof FieldBuilder;
  builder<F extends string>(): t.PropListFieldBuilder<F>;
};

export const PropList = FC.decorate<PropListProps, Fields>(
  View,
  {
    THEMES,
    DEFAULTS,
    FieldSelector,
    FieldBuilder,
    builder: FieldBuilder,
  },
  { displayName: 'PropList' },
);
