import { ArgsCard } from './ui.Main.ArgsCard';
import { Config } from './ui.Main.Config';
import { renderTop } from './ui.Main.u.render';
import { Run } from './ui.Main.Run';

import { DEFAULTS, FC, type t } from './common';
import { View } from './ui.Main.ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Config: typeof Config;
  ArgsCard: typeof ArgsCard;
  Run: typeof Run;
  renderTop: typeof renderTop;
};

export const Main = FC.decorate<t.MainProps, Fields>(
  View,
  { DEFAULTS, Config, ArgsCard, Run, renderTop },
  { displayName: DEFAULTS.displayName },
);
