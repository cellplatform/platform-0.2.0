import { createContext } from 'react';
import { Model } from '../ui.LabelItem.Model';
import { type t } from './common';

/**
 * NB: Dummy model used for initial value.
 *     This is replaced by the real instance in usage.
 */
const dummy = Model.List.state();
const dispatch = Model.List.commands(dummy);

/**
 * List Context
 */
export const ListContext = createContext<t.LabelListContext>({
  dispatch,
  events: (dispose$) => dummy.events(dispose$),
  get list() {
    return dummy.current;
  },
});
