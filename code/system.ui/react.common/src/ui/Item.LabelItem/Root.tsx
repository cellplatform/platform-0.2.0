import { DEFAULTS, FC, type t } from './common';
import { ForwardRef } from './Root.ForwardRef';
import { State } from '../Item.LabelItem.Stateful/State';
import { LabelItemStateful as Stateful } from '../Item.LabelItem.Stateful/Root';

const BehaviorSelector = Stateful.BehaviorSelector;

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  State: typeof State;
  Stateful: typeof Stateful;
  BehaviorSelector: typeof BehaviorSelector;
};
export const LabelItem = FC.decorate<t.LabelItemProps, Fields>(
  ForwardRef,
  { DEFAULTS, State, Stateful, BehaviorSelector },
  { displayName: 'LabelItem' },
);
