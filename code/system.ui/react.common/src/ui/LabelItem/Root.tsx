import { DEFAULTS, FC, type t } from './common';

import { Model } from '../LabelItem.Model';
import { LabelItemStateful as Stateful } from '../LabelItem.Stateful/Root';
import { BehaviorSelector } from '../LabelItem.Stateful/ui.Config.BehaviorSelector';
import { ListContext } from './Context.List';
import { ForwardRef } from './Root.ForwardRef';
import { Button } from './ui.Button';

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Model: typeof Model;
  Stateful: typeof Stateful;
  Button: typeof Button;
  BehaviorSelector: typeof BehaviorSelector;
  ListContext: typeof ListContext;
};
export const LabelItem = FC.decorate<t.LabelItemProps, Fields>(
  ForwardRef,
  {
    DEFAULTS,
    Model,
    Stateful,
    Button,
    BehaviorSelector,
    ListContext,
  },
  { displayName: 'LabelItem' },
);
