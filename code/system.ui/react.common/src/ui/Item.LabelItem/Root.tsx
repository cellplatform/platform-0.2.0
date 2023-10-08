import { DEFAULTS, FC, type t } from './common';

import { LabelItemStateful as Stateful } from '../Item.LabelItem.Stateful/Root';
import { BehaviorSelector } from '../Item.LabelItem.Stateful/ui.Config.BehaviorSelector';
import { ForwardRef } from './Root.ForwardRef';

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Stateful: typeof Stateful;
  BehaviorSelector: typeof BehaviorSelector;
};
export const LabelItem = FC.decorate<t.LabelItemProps, Fields>(
  ForwardRef,
  {
    DEFAULTS,
    Stateful,
    BehaviorSelector,
  },
  { displayName: 'LabelItem' },
);
