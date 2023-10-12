import { DEFAULTS, FC, type t } from './common';

import { LabelItemStateful as Stateful } from '../LabelItem.Stateful/Root';
import { BehaviorSelector } from '../LabelItem.Stateful/ui.Config.BehaviorSelector';
import { ForwardRef } from './Root.ForwardRef';
import { Button } from './ui.Button';

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Stateful: typeof Stateful;
  Button: typeof Button;
  BehaviorSelector: typeof BehaviorSelector;
};
export const LabelItem = FC.decorate<t.LabelItemProps, Fields>(
  ForwardRef,
  {
    DEFAULTS,
    Stateful,
    Button,
    BehaviorSelector,
  },
  { displayName: 'LabelItem' },
);
