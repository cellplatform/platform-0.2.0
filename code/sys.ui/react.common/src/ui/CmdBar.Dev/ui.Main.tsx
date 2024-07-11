import { ArgsCard } from './ui.Main.ArgsCard';
import { Config } from './ui.Main.Config';
import { renderTop } from './ui.Main.u.render';

import { DEFAULTS, FC, type t } from './common';
import { View } from './ui.Main.v';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  ArgsCard: typeof ArgsCard;
  Config: typeof Config;
  renderTop: typeof renderTop;
};

export const Main = FC.decorate<t.MainProps, Fields>(
  View,
  { DEFAULTS, ArgsCard, Config, renderTop },
  { displayName: DEFAULTS.displayName },
);
